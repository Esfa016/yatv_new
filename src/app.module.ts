import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProgramsModule } from './programs/programs.module';
import { ReportsModule } from './reports/reports.module';
import { IssuesModule } from './issues/issues.module';
import { DepartmentsModule } from './departments/departments.module';


@Module({
  imports: [AuthModule, ProgramsModule, ReportsModule, IssuesModule, DepartmentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
