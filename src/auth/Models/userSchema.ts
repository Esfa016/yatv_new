import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AccountStatus } from '../Types/accountStatus';
import { UserRoles } from '../Types/roles';
import * as bcrypt from 'bcrypt'
@Schema({ timestamps: true, strict: false })
export class Users{
    @Prop()
    firstName: String
     @Prop()
    lastName: String
    @Prop()
    username: String
    @Prop({default:'123456'})
    userPin: String
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    department: mongoose.Schema.Types.ObjectId
    @Prop({ type: String })
    phoneNumber: String
    @Prop({ type: String, enum: AccountStatus , default:AccountStatus.ACTIVE })
    status: AccountStatus
    @Prop({ type: String, enum: UserRoles })
    role:UserRoles
}

export const UsersSchema = SchemaFactory.createForClass(Users)

UsersSchema.pre('save', async function (next) {
    this.username = this.firstName.toString()+this.lastName.toString()+'@yatv.com'
    const hashed = await bcrypt.hash(this.userPin, 8)
    this.userPin = hashed
    next()
})