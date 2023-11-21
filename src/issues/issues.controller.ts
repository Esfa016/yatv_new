import { Controller ,Res,Req, Body,Post,Get,Put,Delete,Param,UseGuards, Query} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { UserAuthGuard } from 'src/auth/Jwt/authGuard';
import { RbacGuard } from 'src/auth/Guards/roleGuard';
import { UserRoles } from 'src/auth/Types/roles';
import { CreateIssueDTO } from './Validations/issueDTO';
import { MongooseIdDto, PaginationDto } from 'src/Global/helpers';

@Controller('issues')
export class IssuesController {
  constructor(private issueService: IssuesService) {}

  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.EDITOR]))
  @Post()
  createIssue(@Res() response, @Req() request, @Body() body: CreateIssueDTO) {
    return this.issueService.createIssue(response, body, request.user.id);
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.SUPER_ADMIN]))
  @Get()
  getAll(@Res() response, @Query() query: PaginationDto) {
    return this.issueService.getAllIssues(response, query);
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.SUPER_ADMIN]))
  @Get('/program/:id')
  getByProduct(@Res() response, @Param() param: MongooseIdDto) {
    return this.issueService.getProgramIssue(response, param.id);
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.EDITOR]))
  @Get('/own')
  getOwn(@Res() response, @Query() query:PaginationDto, @Req() request) {
      return this.issueService.getOwnIssues(response,request.user.id,query)
  }
}
