import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Roles} from 'src/member/roles.decorator';
import {AuthService} from './auth.service';

@UseGuards(AuthGuard('google'))
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Get('google')
    @Roles()
    async googleAuth(@Req() req) {
    }

    @Get('google/callback')
    @Roles()
    googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req);
    }
}
