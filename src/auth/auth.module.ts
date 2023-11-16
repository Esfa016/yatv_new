import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users , UsersSchema} from './Models/userSchema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({global:true,secret:process.env.JWT_USER,signOptions:{expiresIn:'1d'}}),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
