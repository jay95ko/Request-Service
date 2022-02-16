import { IsEmail, IsString} from 'class-validator';

export class AddAdminDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly accessToken: string;

    @IsString()
    readonly grade: string;
}
