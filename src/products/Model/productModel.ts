import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop()
  title: String;
  @Prop()
  quantity: Number;
  @Prop({ required: false })
  description: String;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
