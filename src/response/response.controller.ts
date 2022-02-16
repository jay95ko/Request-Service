import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common'
import { ResponseService } from './response.service'
import { ResponseTemplate } from '../model/response-template'
import { BaseController } from '../common/controller/base-controller'
import { Request } from '../entity/request.entity'
import { CreateResponseDto } from './dto/create-response.dto'
import { UpdateResponseDto } from './dto/update-response.dto'
import { Roles } from 'src/member/roles.decorator'
import { MemberGuard } from 'src/member/member.guard'

@Controller('requests')
export class ResponseController extends BaseController {
  constructor(private readonly responseService: ResponseService) {
    super()
  }

  @Post(':idx/answer')
  @Roles(MemberGuard.ADMIN)
  async save(
    @Param('idx') idx: number,
    @Body() dto: CreateResponseDto,
  ): Promise<ResponseTemplate> {
    const entity = await this.responseService.save(idx, dto)
    return new ResponseTemplate(entity, '성공')
  }

  @Put('answer/:idx')
  @Roles(MemberGuard.ADMIN)
  async update(
    @Req() req,
    @Param('idx', new ParseIntPipe()) idx: string,
    @Body() dto: UpdateResponseDto,
  ): Promise<ResponseTemplate> {
    const entitiy = await this.responseService.update(req, idx, dto)
    return new ResponseTemplate(entitiy, '성공')
  }
}
