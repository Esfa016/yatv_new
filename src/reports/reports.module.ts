import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { AuthModule } from 'src/auth/auth.module';
import { ProgramsModule } from 'src/programs/programs.module';

@Module({
  imports: [ ProgramsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
