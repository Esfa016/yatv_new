import { HttpStatus, Injectable, InternalServerErrorException, Res } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ProgramsService } from 'src/programs/programs.service';
import {Response} from 'express'
import { ErrorMessage } from 'src/Global/messages';

@Injectable()
export class ReportsService {
    constructor(private authService: AuthService, private programService: ProgramsService) { }
    
    async statistics(@Res() response: Response) {
        try {
            const userStats = await this.authService.userReports()
            const programStats = await this.programService.getProgramReports()
            return response.status(HttpStatus.OK).json({
                success: true,
                userStats: userStats,
                programStats:programStats
            })
         }
        catch (error) {
            console.error(error)
            throw new InternalServerErrorException(ErrorMessage.internalServerError)
        }
    }
}
