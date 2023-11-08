import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({ timestamps: true, strict: false })
export class Users{
    @Prop()
    fullName: String
    @Prop()
    username: String
    @Prop()
    userPin: String
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    department:mongoose.Schema.Types.ObjectId
}