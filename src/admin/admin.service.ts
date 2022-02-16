import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import {BaseService} from "../common/service/base-service";
import {Member} from "../entity/member.entity";
import {Grade} from "../entity/grade.entity";

@Injectable()
export class AdminService extends BaseService {
    constructor(
        @InjectRepository(Grade) private readonly gradeRepository: Repository<Grade>,
        @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    ) {
        super();
    }

    async save(idx: number) {
        let model = await this.memberRepository.findOne(idx);
        model.grade = await this.gradeRepository.findOne('admin');
        return this.transaction((manager) => {
            return manager.save(model, manager);
        }, (err => {
            return err;
        }));
    }

    async update(idx: number) {
        let model = await this.memberRepository.findOne(idx);
        model.grade = await this.gradeRepository.findOne('member');
        return this.transaction((manager) => {
            return manager.save(model, manager);
        }, (err => {
            return err;
        }));
    }

}
