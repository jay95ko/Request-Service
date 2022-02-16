import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Request } from '../entity/request.entity'
import { Response } from 'src/entity/response.entity'
import { BaseService } from '../common/service/base-service'
import { CreateResponseDto } from './dto/create-response.dto'
import { RequestStatus } from '../entity/request-status.entity'
import { UpdateResponseDto } from './dto/update-response.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Member } from 'src/entity/member.entity'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class ResponseService extends BaseService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Response)
    private readonly responseRepository: Repository<Response>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {
    super()
  }

  async save(idx: number, dto: CreateResponseDto) {
    const request = await this.requestRepository.findOne(idx)
    return this.transaction(manager => {
      const model = new Response()
      model.request = request
      model.setProps(dto.getProps())
      const status = new RequestStatus()
      status.code = dto.response_status
      model.status = status
      const admin = new Member()
      admin.idx = 1
      model.admin = admin
      //throw new Error('123')
      return manager.save(model, manager)
    })
  }

  async update(req, idx: string, dto: UpdateResponseDto) {
    this.authService.checkPermission(
      req,
      await this.responseRepository.findOne(idx, {
        relations: ['admin'],
      }),
    )
    const model = await this.responseRepository.findOne(idx)
    model.setProps(dto.getProps())
    return this.transaction(
      manager => {
        return manager.save(model, manager)
      },
      err => {
        return err
      },
    )
  }
}
