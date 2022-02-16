import {Module} from '@nestjs/common'
import {MembersController} from './members.controller'
import {MembersService} from './members.service'
import {TypeOrmModule} from "@nestjs/typeorm";
import {Member} from "../entity/member.entity";
import {Grade} from 'src/entity/grade.entity';
import {Team} from 'src/entity/team.entity';
import {HttpModule} from '@nestjs/axios';
import {JwtModule} from '@nestjs/jwt';
import {config} from 'dotenv';

config();

@Module({
    imports: [TypeOrmModule.forFeature([Member, Team, Grade]), HttpModule, JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: '60d'},
    }),],
    controllers: [MembersController],
    providers: [MembersService],
    /*providers: [MembersService, {
        provide: APP_GUARD,
        useClass: MemberGuard,
    }],*/
    exports: [MembersService]
})

export class MembersModule {}
