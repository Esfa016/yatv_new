import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
@Schema({timestamps:true})
export  class Departments{
    @Prop()
    title:String
    @Prop()
    responsibilities:String
}
export const DepratmentSchema = SchemaFactory.createForClass(Departments)