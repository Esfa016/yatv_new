import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Product } from './Model/productModel';
import { ProductCreateDto, ProductUpdateDTO } from './Validation/productDto';
import { ErrorMessage } from 'src/Global/messages';
import { PaginationDto, PaginationHelper } from 'src/Global/helpers';
import { Response } from 'express';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async create(product: ProductCreateDto, @Res() response:Response) {
    try {
      const data = await this.productModel.create(product);
      return response.status(HttpStatus.CREATED).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getAll(@Res() response:Response, paginate:PaginationDto ) {
    try {
        const data = await this.productModel.find().skip(PaginationHelper.paginateQuery(paginate)).limit(paginate.limit);
      return response.status(HttpStatus.OK).json({ success: true, data: data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getOne(id: mongoose.Schema.Types.ObjectId, @Res() response:Response) {
    try {
      const data = await this.productModel.findById(id);
      if (!data) throw new NotFoundException(ErrorMessage.productNotFound);
      return response.status(HttpStatus.OK).json({
        success: true,
        data: data,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error();
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async updateOne(
    id: mongoose.Schema.Types.ObjectId,
    @Res() response:Response,
    product: ProductUpdateDTO,
  ) {
    try {
      const data = await this.productModel.findByIdAndUpdate(id, product);
      if (!data) throw new NotFoundException(ErrorMessage.productNotFound);
      return response.status(HttpStatus.OK).json({
        success: true,
        data: product,
        message: 'Successfully updated',
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error();
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async deleteOne(id: mongoose.Types.ObjectId, @Res() response:Response): Promise<Response> {
    try {
      const deleted = await this.productModel.findOneAndDelete({ _id: id });
      if (!deleted) throw new NotFoundException(ErrorMessage.productNotFound);
      return response.status(HttpStatus.OK).json({
        success: true,
        data: deleted,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async searchProduct(response: Response, title: string) {
    try {
      console.log(title)
      const regex = new RegExp(title, 'i')
      const data = await this.productModel.find({ title: { $regex: regex } })
      return response.status(HttpStatus.OK).json({success:true, product:data})
     }
    catch (error) {
      console.error(error)
      throw new InternalServerErrorException(ErrorMessage.internalServerError)
    }
  }
}
