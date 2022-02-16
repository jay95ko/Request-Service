import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    Headers,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import {MembersService} from './members.service'
import {CreateMemberDto} from './dto/createMemberDto'
import {Member} from 'src/entity/member.entity'
import {MemberGuard} from './member.guard'
import {Roles} from './roles.decorator'
import {ResponseTemplate} from '../model/response-template'

@UseGuards(MemberGuard)
@Controller('member')
export class MembersController {
    constructor(private readonly membersService: MembersService) {
    }

    //회원가입
    @Post('signup')
    async createMember(
        @Body() memberData: CreateMemberDto,
        @Headers() headers,
    ): Promise<Member> {
        return await this.membersService.create(memberData, headers.authorization)
    }

    //로그인
    @Post('login')
    async login(@Headers() headers): Promise<Member> {
        return await this.membersService.login(headers.authorization)
    }

    @Post('logout')
    @Roles(MemberGuard.MEMBER)
    async logout(@Headers() headers): Promise<any> {
    }

    @Get('')
    @Roles(MemberGuard.ADMIN)
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
    ): Promise<ResponseTemplate> {
        limit = limit > 50 ? 50 : limit
        const data = await this.membersService.paginate({
            page,
            limit,
            route: '/member',
        })
        return new ResponseTemplate(data, '성공')
    }

}
