import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from 'typeorm';
import {Member} from 'src/entity/member.entity';
import {AuthenticationError} from "../auth/errors/authentication.error";

/**
 * @Roles()
 * request.member 가 Header 의 Authorization 에 따라 존재할 수도, 안 할 수도 있습니다
 *
 * @Roles(MemberGuard.MEMBER)
 * request.member 가 존재하고 올바르지 않는 Authorization 일 경우 AuthenticationError 를 throw 합니다
 *
 * @Roles(MemberGuard.ADMIN)
 * MemberGuard.Member 과 같으며, Grade 가 Admin 인 회원만 접근 가능합니다
 */
@Injectable()
export class MemberGuard implements CanActivate {
    public static MEMBER: string = 'member';
    public static ADMIN: string = 'admin';

    constructor(
        private reflector: Reflector,
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const role = !roles ? '' : roles[0];
        const request = context.switchToHttp().getRequest();
        const accessToken = request.headers.authorization

        const member = await this.memberRepository.findOne({
            where: {auth_key: accessToken},
            relations: ['team', 'grade'],
        })

        request.member = member;
        if (role == '' || role == undefined) {
            return true;
        } else if (member == undefined) {
            throw new AuthenticationError();
        } else {
            return (role === member.grade.code || "admin" === member.grade.code);
        }
    }
}
