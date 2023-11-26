import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Users } from 'src/auth/Models/userSchema';
import { Departments } from 'src/departments/Models/departmentSchema';
import { Product } from 'src/products/Model/productModel';
import { Programs } from 'src/programs/Models/programSchema';
@Schema({ timestamps: true })
export class Issue extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Programs.name })
  processedProgram: mongoose.Schema.Types.ObjectId;
  @Prop()
  beginDate: Date;
  @Prop()
  endDate: Date;
  @Prop({ required: false })
  challenges: String;
  @Prop({ required: false })
  remainingWork: String;
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:Departments.name})
  department: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Users.name })
  editor: mongoose.Schema.Types.ObjectId;
  @Prop()
  type: String;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);
