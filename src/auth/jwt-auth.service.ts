import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "src/entity/member.entity";
import { Repository } from "typeorm";
import {AuthenticationError} from "./errors/authentication.error";

@Injectable()
export class JwtAuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(Member)
            private memberRepository: Repository<Member>,
        ) {}

    // Token에 있는 auth_key과 실제 auth_key을 비교.
    async validateAccount(accessToken): Promise<any> {
        console.log(accessToken)
        const member = await this.memberRepository.findOne({where: {auth_key : accessToken}})
        if (!member) {
            throw new AuthenticationError();
        }
        console.log(`validateAccount Success`);
        const {...result} = member;
        return result;
    }

    // Member를 받으면 JWT토큰을 새로 발급한다.
    makeAccessToken(member: Member) {
        return this.jwtService.sign({'auth_key': member.auth_key});
    };
}
