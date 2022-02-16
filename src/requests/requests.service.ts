import {Injectable} from '@nestjs/common';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {Request} from "../entity/request.entity";
import {IPaginationOptions, paginate, Pagination,} from 'nestjs-typeorm-paginate';
import {InjectRepository} from "@nestjs/typeorm";
import {BaseService} from "../common/service/base-service";
import {CreateRequestDto} from "./dto/create-request.dto";
import {RequestStatus} from "../entity/request-status.entity";
import {UpdateRequestDto} from "./dto/update-request.dto";
import {Member} from "../entity/member.entity";
import {RequestType} from "../entity/request-type.entity";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class RequestsService extends BaseService {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(Request) private readonly repository: Repository<Request>,
        @InjectRepository(RequestStatus) private readonly statusRepository: Repository<RequestStatus>,
        @InjectRepository(RequestType) private readonly typeRepository: Repository<RequestType>,
    ) {
        super();
    }

    async paginate(req, options: IPaginationOptions): Promise<Pagination<any>> {
        const date = this.getPrevMonthDate(3);
        const queryBuilder = this.paginateQuery().where("request.updated_at>=:date", {
            date: date
        });
        const results = await paginate(queryBuilder, options);
        return this.buildPagination(req, results);
    }

    async paginateMyRequests(req, idx: number, options: IPaginationOptions): Promise<Pagination<any>> {
        const queryBuilder = this.paginateQuery().where("request.memberIdx=:idx", {idx: idx});
        const results = await paginate(queryBuilder, options);
        return this.buildPagination(req, results);
    }

    async pastPaginate(req, options: IPaginationOptions): Promise<Pagination<any>> {
        const date = this.getPrevMonthDate(3);
        const queryBuilder = this.paginateQuery().where("request.updated_at<=:date", {
            date: date
        });
        const results = await paginate(queryBuilder, options);
        return this.buildPagination(req, results);
    }

    paginateQuery(): SelectQueryBuilder<Request> {
        const queryBuilder = this.repository.createQueryBuilder('request');
        return queryBuilder
            .leftJoinAndSelect("request.request_type", 'type')
            .leftJoinAndSelect("request.request_status", 'status')
            .leftJoinAndSelect("request.member", 'member')
            .leftJoinAndSelect("member.team", 'team')
            .leftJoinAndSelect("request.responses", 'responses')
            .orderBy('request.idx', 'DESC');
    }

    async buildPagination(req, results) {
        return new Pagination(
            await Promise.all(
                results.items.map(async (item: Request) => {
                    item.bindDate();
                    return {
                        ...item,
                        editable: req.member ? req.member.idx == item.member.idx : false
                    };
                }),
            ),
            results.meta,
            results.links,
        );
    }


    async findOne(req, idx: string) {
        let result = await this.repository.findOne(idx, {
            relations: ['member', 'member.team', 'responses', 'responses.status', 'responses.admin']
        });
        return {
            ...result,
            editable: req.member ? req.member.idx == result.member.idx : false
        };
    }

    save(dto: CreateRequestDto) {
        return this.transaction((manager) => {
            let model = new Request();
            model.setProps(dto.getProps());
            let status = new RequestStatus();
            status.code = 'ready';
            model.request_status = status;
            let member = new Member();
            member.idx = 1;
            model.member = member;
            return manager.save(model, manager);
        }, (err => {
            return err;
        }));
    }

    async update(req, idx: string, dto: UpdateRequestDto) {
        /**
         * relations 에 member 를 추가해야 checkPermission 함수에서
         * request.member 를 사용할 수 있습니다
         */
        this.authService.checkPermission(req, await this.repository.findOne(idx, {
            relations: ['member']
        }));

        let model = await this.repository.findOne(idx);
        model.setProps(dto.getProps());
        return this.transaction((manager) => {
            return manager.save(model, manager);
        }, (err => {
            return err;
        }));
    }

    async delete(req, idx: number) {
        this.authService.checkPermission(req, await this.repository.findOne(idx, {
            relations: ['member']
        }));

        return this.repository.delete(idx);
    }

    status() {
        return this.statusRepository.find();
    }

    type() {
        return this.typeRepository.find();
    }

    private getPrevMonthDate(month: number) {
        const now = new Date();
        now.setMonth(now.getMonth() - month);
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return now;
    }
}
