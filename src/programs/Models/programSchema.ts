import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from 'src/auth/Models/userSchema'
import mongoose from 'mongoose';
import { Product } from 'src/products/Model/productModel';
import { Departments } from 'src/departments/Models/departmentSchema';


export enum requestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
@Schema({ timestamps: true, strict: false })
export class Programs {
  @Prop({ type: Date })
  recordingDate: Date;
  @Prop()
  startTime: String;
  @Prop()
  endTime: String;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Departments.name })
  department: mongoose.Schema.Types.ObjectId;
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
  })
  approvedBy: mongoose.Schema.Types.ObjectId;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Users.name }] })
  assignedCameraMen: mongoose.Schema.Types.ObjectId[];
  @Prop()
  type: String;
  @Prop()
  description: String;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Product.name }] })
  equipments: mongoose.Schema.Types.ObjectId[];
  @Prop({ type: String, enum: requestStatus, default: requestStatus.PENDING })
  status: String;
  @Prop({ required: false })
  challengesFaced: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
    required: false,
  })
  producerDetails: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
    required: false,
  })
  assignedEditor: mongoose.Schema.Types.ObjectId;
}
export const ProgramSchema = SchemaFactory.createForClass(Programs);
