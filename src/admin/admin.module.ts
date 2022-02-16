import {Module} from '@nestjs/common'
import {TypeOrmModule} from "@nestjs/typeorm";
import {Member} from "../entity/member.entity";
import {AdminService} from "./admin.service";
import {AdminController} from "./admin.controller";
import {Grade} from "../entity/grade.entity";
import {Team} from "../entity/team.entity";
import {MembersModule} from "../member/members.module";

@Module({
    imports: [TypeOrmModule.forFeature([Team, Grade, Member]), MembersModule],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminsModule {
}
