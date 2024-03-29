import { HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Product } from './Model/productModel';
import { ProductCreateDto, ProductUpdateDTO } from './Validation/productDto';
import { ErrorMessage } from 'src/Global/messages';
import { PaginationDto, PaginationHelper, SearchDTO } from 'src/Global/helpers';
import { Response } from 'express';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async create(product: ProductCreateDto, response:Response) {
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

  async getAll(response:Response, paginate:PaginationDto ) {
    try {
      const totalData = await this.productModel.countDocuments({
        quantity: { $gt: 0 },
      });
        const data = await this.productModel.find({quantity:{$gt:0}}).skip(PaginationHelper.paginateQuery(paginate)).limit(paginate.limit);
      return response.status(HttpStatus.OK).json({ success: true, data: data, totalData:totalData });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }

  async getOne(id: mongoose.Schema.Types.ObjectId, response:Response) {
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
    response:Response,
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

  async deleteOne(id: mongoose.Types.ObjectId, response:Response): Promise<Response> {
    try {
      const deleted = await this.productModel.findOneAndDelete({ _id: id });
      if (!deleted) throw new NotFoundException(ErrorMessage.productNotFound);
      return response.status(HttpStatus.OK).json({
        success: true,
        data: deleted,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ErrorMessage.internalServerError);
    }
  }
  async searchProduct(response: Response, title: string, pagination:SearchDTO) {
    try {
      console.log(title)
      const regex = new RegExp(title, 'i')
      const totalData = await this.productModel.countDocuments({
        title: { $regex: regex },
      });
      const data = await this.productModel.find({ title: { $regex: regex } }).skip(PaginationHelper.paginateQuery(pagination)).limit(pagination.limit)
      return response.status(HttpStatus.OK).json({success:true, product:data, totalData:totalData})
     }
    catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException(ErrorMessage.internalServerError)
    }
  }
}
