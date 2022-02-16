import {Module} from '@nestjs/common'
import {RequestsService} from './requests.service'
import {RequestsController} from './requests.controller'
import {TypeOrmModule} from "@nestjs/typeorm";
import {Request} from "../entity/request.entity";
import {RequestType} from "../entity/request-type.entity";
import {RequestStatus} from "../entity/request-status.entity";
import {Member} from "../entity/member.entity";
import {AuthService} from "../auth/auth.service";

@Module({
    imports: [TypeOrmModule.forFeature([Request, RequestType, RequestStatus, Member])],
    providers: [RequestsService, AuthService],
    controllers: [RequestsController],
})
export class RequestsModule {
}
