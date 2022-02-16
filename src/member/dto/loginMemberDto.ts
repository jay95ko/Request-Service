import { IsNumber, IsString } from 'class-validator';

export class LoginMemberDto {
    @IsString()
    readonly accessToken: string;
}
