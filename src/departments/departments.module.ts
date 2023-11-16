import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Departments, DepratmentSchema } from './Models/departmentSchema';

@Module({
  imports:[MongooseModule.forFeature([{name:Departments.name, schema:DepratmentSchema}])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService]
})
export class DepartmentsModule {}
