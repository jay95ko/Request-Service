import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {BaseDto} from "../../common/dto/base-dto";

export class CreateRequestDto extends BaseDto {

    @IsString()
    @IsNotEmpty()
    request_type: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    contents: string

}
