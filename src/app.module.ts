import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import {LoggerModule} from './common/logger/logger.module'
import {MembersModule} from './member/members.module'
import {LoggerMiddleware} from './common/middleware/logger.middleware'
import {RequestsModule} from './requests/requests.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Connection} from 'typeorm'
import {ResponseModule} from './response/response.module'
import {AdminsModule} from "./admin/admin.module";
import {AuthModule} from './auth/auth.module'
import {AuthService} from "./auth/auth.service";
import {UtilModule} from "./common/util/util.module";

@Module({
    imports: [
        MembersModule,
        LoggerModule,
        RequestsModule,
        AdminsModule,
        // SchedulerModule,
        // ScheduleModule.forRoot(),
        TypeOrmModule.forRoot(),
        ResponseModule,
        AuthModule,
        UtilModule,
    ],
    providers: [AuthService],
})

export class AppModule implements NestModule {
    constructor(private connection: Connection) {
    }

    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }

}
