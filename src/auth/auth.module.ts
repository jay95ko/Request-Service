import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {MembersModule} from 'src/member/members.module';
import {PassportModule} from '@nestjs/passport';
import {GoogleStrategy} from './passport/google.strategy';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './jwt.strategy';
import {JwtAuthService} from './jwt-auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Member} from 'src/entity/member.entity';
import {Team} from 'src/entity/team.entity';
import {Grade} from 'src/entity/grade.entity';

@Module({
    imports: [
        MembersModule,
        PassportModule,
        JwtModule.register({secret: process.env.JWT_SECRET, signOptions: {expiresIn: '60s'},}),
        TypeOrmModule.forFeature([Member, Team, Grade])],
    providers: [AuthService, GoogleStrategy, JwtStrategy, JwtAuthService],
    controllers: [AuthController],
})
export class AuthModule {
}
