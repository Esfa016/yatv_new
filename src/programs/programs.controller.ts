import { Controller , Post,Get,Put,Delete,Body,UseGuards,Query,Param, Req,Res} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { PaginationDto } from 'src/Global/helpers';
import { UserAuthGuard } from 'src/auth/Jwt/authGuard';
import { RequestCreateDTO } from './Validations/programDto';

@Controller('programs')
export class ProgramsController {
    constructor(private programService: ProgramsService) { }
    
    @Get('/')
    getFiltered(@Res() response, @Query() reqQuery:PaginationDto) {
        return this.programService.getRequests(response,reqQuery)
    }
    @UseGuards(UserAuthGuard)
    @Post('/')
    requestProgram(@Res() response, @Body() body:RequestCreateDTO, @Req()request) {
        return this.programService.requestProgram(response,body,request.user)
    }
}
