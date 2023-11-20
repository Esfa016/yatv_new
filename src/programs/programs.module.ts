import { Module } from '@nestjs/common';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramSchema, Programs } from './Models/programSchema';

@Module({
  imports:[MongooseModule.forFeature([{name:Programs.name,schema:ProgramSchema}])],
  controllers: [ProgramsController],
  providers: [ProgramsService]
})
export class ProgramsModule {}
