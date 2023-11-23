import { Controller, UseGuards, Get , Res} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { UserAuthGuard } from 'src/auth/Jwt/authGuard';
import { RbacGuard } from 'src/auth/Guards/roleGuard';
import { UserRoles } from 'src/auth/Types/roles';

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) { }
    @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.SUPER_ADMIN]))
    @Get()
    getReports(@Res() response) {
        return this.reportService.statistics(response)
    }
}
