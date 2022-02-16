import { Module } from '@nestjs/common'
import { ResponseService } from './response.service'
import { ResponseController } from './response.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Response } from 'src/entity/response.entity'
import { Request } from 'src/entity/request.entity'
import { AuthService } from 'src/auth/auth.service'

@Module({
  imports: [TypeOrmModule.forFeature([Request, Response])],
  controllers: [ResponseController],
  providers: [ResponseService, AuthService],
})
export class ResponseModule {}
