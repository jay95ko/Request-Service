import {Controller, Param, ParseIntPipe, Post, Put, Req, UseGuards} from '@nestjs/common';
import {ResponseTemplate} from "../model/response-template";
import {BaseController} from "../common/controller/base-controller";
import {AdminService} from "./admin.service";
import {MemberGuard} from "../member/member.guard";
import {Roles} from "../member/roles.decorator";

@UseGuards(MemberGuard)
@Controller('admin')
export class AdminController extends BaseController {
    constructor(
        private readonly adminService: AdminService,
    ) {
        super();
    }

    @Post(':idx')
    @Roles(MemberGuard.ADMIN)
    async save(@Param('idx', new ParseIntPipe()) idx: number): Promise<ResponseTemplate> {
        const entity = await this.adminService.save(idx);
        return new ResponseTemplate(entity, '성공');
    }

    @Put(':idx')
    @Roles(MemberGuard.ADMIN)
    async update(@Param('idx', new ParseIntPipe()) idx: number): Promise<ResponseTemplate> {
        return new ResponseTemplate(await this.adminService.update(idx), '성공');
    }

}
