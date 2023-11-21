import { Controller , Patch,Post,Get,Put,Delete,Body,UseGuards,Query,Param, Req,Res} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { MongooseIdDto, PaginationDto } from 'src/Global/helpers';
import { UserAuthGuard } from 'src/auth/Jwt/authGuard';
import { AssignEditorDTO, RequestCreateDTO } from './Validations/programDto';
import { RbacGuard } from 'src/auth/Guards/roleGuard';
import { UserRoles } from 'src/auth/Types/roles';

@Controller('programs')
export class ProgramsController {
  constructor(private programService: ProgramsService) {}

  @Get('/')
  getFiltered(@Res() response, @Query() reqQuery: PaginationDto) {
    return this.programService.getRequests(response, reqQuery);
  }
  @UseGuards(UserAuthGuard)
  @Post('/')
  requestProgram(
    @Res() response,
    @Body() body: RequestCreateDTO,
    @Req() request,
  ) {
    return this.programService.requestProgram(response, body, request.user);
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.PRODUCTION_MANAGER]))
  @Post('/assign')
  assignEditorAndProducer(@Res() response, @Body() body: AssignEditorDTO) {
    return this.programService.assignEditorAndProducer(response, body);
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.SUPER_ADMIN]))
  @Patch('/approve/:id')
  approveRequest(@Res() response, @Param() param: MongooseIdDto) {
    return this.programService.apporveRequest(response, param.id);
  }

  @Patch('/reject/:id')
  rejectRequest(@Res() response, @Param() param: MongooseIdDto) {
    return this.programService.apporveRequest(response, param.id);
  }
    @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.EDITOR]))
    @Get('/assigned')
    getAssigned(@Res() response, @Query() query: PaginationDto, @Req() request) {
        return this.programService.getAssignedPrograms(response,request.user.id,query)
    }
}
