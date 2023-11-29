import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Issue, IssueSchema } from './Models/issuesSchema';
import { ProgramsModule } from 'src/programs/programs.module';

@Module({
  imports: [
  ProgramsModule,
    MongooseModule.forFeature([{ name: Issue.name, schema: IssueSchema }])],
  providers: [IssuesService],
  controllers: [IssuesController]
})
export class IssuesModule {}
