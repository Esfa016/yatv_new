import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProgramsModule } from './programs/programs.module';
import { ReportsModule } from './reports/reports.module';
import { IssuesModule } from './issues/issues.module';
import { DepartmentsModule } from './departments/departments.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_CONN),
    AuthModule,
    ProgramsModule,
    ReportsModule,
    IssuesModule,
    DepartmentsModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
