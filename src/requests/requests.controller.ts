import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import {RequestsService} from './requests.service';
import {ResponseTemplate} from "../model/response-template";
import {BaseController} from "../common/controller/base-controller";
import {CreateRequestDto} from "./dto/create-request.dto";
import {UpdateRequestDto} from "./dto/update-request.dto";
import {Roles} from "../member/roles.decorator";
import {MemberGuard} from "../member/member.guard";

@UseGuards(MemberGuard)
@Controller('requests')
export class RequestsController extends BaseController {
    constructor(
        private readonly requestsService: RequestsService,
    ) {
        super();
    }

    @Get('status')
    async status() {
        return new ResponseTemplate(await this.requestsService.status(), '성공');
    }

    @Get('type')
    async type() {
        return new ResponseTemplate(await this.requestsService.type(), '성공');
    }

    @Get('my')
    @Roles(MemberGuard.MEMBER)
    async my(
        @Req() req,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
    ): Promise<ResponseTemplate> {
        limit = limit > 50 ? 50 : limit;
        let data = await this.requestsService.paginateMyRequests(req, 1, {
            page,
            limit,
            route: '/requests/my',
        });
        return new ResponseTemplate(data, '성공');
    }

    @Get('')
    @Roles()
    async index(
        @Req() req,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
    ): Promise<ResponseTemplate> {
        limit = limit > 50 ? 50 : limit;
        let data = await this.requestsService.paginate(req, {
            page,
            limit,
            route: '/requests',
        });
        return new ResponseTemplate(data, '성공');
    }

    @Get('past')
    async past(
        @Req() req,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
    ): Promise<ResponseTemplate> {
        limit = limit > 50 ? 50 : limit;
        let data = await this.requestsService.pastPaginate(req, {
            page,
            limit,
            route: '/requests',
        });
        return new ResponseTemplate(data, '성공');
    }

    @Get(':idx')
    @Roles()
    async findOne(@Req() req, @Param('idx', new ParseIntPipe()) idx: string): Promise<ResponseTemplate> {
        const entity = await this.requestsService.findOne(req, idx);
        return new ResponseTemplate(entity, '성공');
    }

    @Post('')
    @Roles(MemberGuard.MEMBER)
    async save(@Body() dto: CreateRequestDto): Promise<ResponseTemplate> {
        const entity = await this.requestsService.save(dto);
        return new ResponseTemplate(entity, '성공');
    }

    @Put(':idx')
    @Roles(MemberGuard.MEMBER)
    async update(@Req() req, @Param('idx', new ParseIntPipe()) idx: string, @Body() dto: UpdateRequestDto): Promise<ResponseTemplate> {
        const entity = await this.requestsService.update(req, idx, dto);
        return new ResponseTemplate(entity, '성공');
    }

    @Delete(':idx')
    @Roles(MemberGuard.MEMBER)
    async delete(@Req() req, @Param('idx', new ParseIntPipe()) idx: number): Promise<ResponseTemplate> {
        await this.requestsService.delete(req, idx);
        return new ResponseTemplate(null, '성공');
    }

}
