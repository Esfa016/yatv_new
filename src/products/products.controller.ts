import { Controller,Post,Body,Get,Patch,UseGuards,Req,Res, Param, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateDto, ProductUpdateDTO } from './Validation/productDto';
import { MongooseIdDto, PaginationDto, SearchDTO } from 'src/Global/helpers';
import { UserAuthGuard } from 'src/auth/Jwt/authGuard';
import { RbacGuard } from 'src/auth/Guards/roleGuard';
import { UserRoles } from 'src/auth/Types/roles';
import { sanitize } from 'class-sanitizer';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.STORE]))
  @Post()
  create(@Body() body: ProductCreateDto, @Res() response) {
    return this.productService.create(body, response);
  }
  @Get('/search')
  search(@Res() response, @Query() query: SearchDTO) {
   return this.productService.searchProduct(response,query.title.replace(/\s/g, ''))
  }
  @Get()
  get(@Res() response, @Query() queries: PaginationDto) {
    return this.productService.getAll(response, queries);
  }
  @Get(':id')
  getOne(@Res() response, @Param() id: MongooseIdDto) {
    return this.productService.getOne(id.id, response);
  }
  @UseGuards(UserAuthGuard, new RbacGuard([UserRoles.STORE]))
  @Put(':id')
  update(
    @Res() response,
    @Param() id: MongooseIdDto,
    @Body() product: ProductUpdateDTO,
  ) {
    return this.productService.updateOne(id.id, response, product);
  }
  
}