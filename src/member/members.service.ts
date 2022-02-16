import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {Member} from '../entity/member.entity'
import {InjectRepository} from "@nestjs/typeorm";
import {CreateMemberDto} from './dto/createMemberDto';
import {Team} from 'src/entity/team.entity';
import {Grade} from 'src/entity/grade.entity';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {HttpService} from '@nestjs/axios';
import {lastValueFrom} from 'rxjs';
import {AddAdminDto} from './dto/addAdminDto';
import {BaseService} from 'src/common/service/base-service';
import {JwtService} from '@nestjs/jwt';
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {NotValidTokenError} from "../auth/errors/not-valid-token.error";
import {AlreadyExistError} from "../auth/errors/already-exist.error";


@Injectable()
export class MembersService extends BaseService {
    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        @InjectRepository(Grade)
        private readonly gradeRepository: Repository<Grade>,
        private httpService: HttpService,
        private jwtService: JwtService,
    ) {
        super();
    }

    private async buildGoogleInfo(googleToken, exception: Error) {
        const GOOGLE_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json"
        const HEADER = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${googleToken.Authorization}`,
        };

        //Google사이트로 accessToken사용하여 사용자 정보 요청
        return await lastValueFrom(this.httpService.get(GOOGLE_INFO_URL, {headers: HEADER})).catch((error) => {
            throw exception;
        });
    }

    async create(memberData: CreateMemberDto, googleToken): Promise<Member> {
        const {teamID, department} = memberData;

        //Google사이트로 accessToken사용하여 사용자 정보 요청
        const googleInfo = await this.buildGoogleInfo(googleToken, new NotValidTokenError());

        const TEAM = await this.teamRepository.findOne(teamID);
        const GRADE = await this.gradeRepository.findOne("member");
        const existMember = await this.memberRepository.findOne({where: {email: googleInfo.data.email}})

        if (existMember) {
            throw new AlreadyExistError();
        }

        const member = new Member();
        member.grade = GRADE
        member.team = TEAM
        member.name = googleInfo.data.name
        member.email = googleInfo.data.email
        member.department = department
        member.auth_key = googleToken.Authorization

        return this.transaction((manager) => {
            return manager.save(member, manager);
        }, (err => {
            return err;
        }));
    }

    async login(googleToken): Promise<Member> {
        const googleInfo = await this.buildGoogleInfo(googleToken, new NotValidTokenError());

        const MEMBER = await this.memberRepository.findOne({
            where: {email: googleInfo.data.email},
            relations: ['team', 'grade'],
        });

        const AUTH_KEY = this.jwtService.sign({access_token: googleToken})

        if (!MEMBER) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: "Dose not exist member need login"
            }, HttpStatus.NOT_FOUND)
        }
        MEMBER.auth_key = AUTH_KEY
        return this.transaction((manager) => {
            return manager.save(MEMBER, manager);
        }, (err => {
            return err;
        }));
    }

    async roles(memberData: AddAdminDto): Promise<Member> {
        const {email, grade} = memberData;

        const MEMBER = await this.memberRepository.findOne({
            where: {email: email},
            relations: ['team', 'grade'],
        });
        const GRADE = await this.gradeRepository.findOne(grade);

        if (!MEMBER) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: "Dose not exist member check email"
            }, HttpStatus.NOT_FOUND)
        }

        MEMBER.grade = GRADE
        return this.transaction((manager) => {
            return manager.save(MEMBER, manager);
        }, (err => {
            return err;
        }));
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Member>> {
        const queryBuilder = this.paginateQuery()
        const results = await paginate(queryBuilder, options)
        return new Pagination(
            await Promise.all(
                results.items.map(async (item: Member) => {
                    item.bindDate()
                    return item
                }),
            ),
            results.meta,
            results.links,
        )
    }

    paginateQuery(): SelectQueryBuilder<Member> {
        const queryBuilder = this.memberRepository.createQueryBuilder('member')
        return queryBuilder
            .where('member.grade = :grade', { grade: 'member' })
            .leftJoinAndSelect('member.grade', 'grade')
            .leftJoinAndSelect('member.team', 'team')
            .orderBy('member.idx', 'DESC')
    }
}