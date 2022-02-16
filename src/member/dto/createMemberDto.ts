import { IsNumber, IsString } from 'class-validator';

export class CreateMemberDto {

    @IsString()
    readonly teamID: string;

    @IsString()
    readonly department: string;
}
