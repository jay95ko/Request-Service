import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { BaseDto } from '../../common/dto/base-dto'

export class CreateResponseDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  response_status: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  response: string
}
