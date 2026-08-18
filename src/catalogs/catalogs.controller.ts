import { Controller, Query, Get, Param, Body, Post, UseGuards ,Patch,Delete} from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCategoryDto } from './dtos/catogeriesDto';
import { ProductDto } from './dtos/productsDto';
import { UpdateProductDto } from './dtos/updateproductDto';
import { ProductQueryDto } from './dtos/productqueryDto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guards';
import { Roles } from '../decoraters/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';


@ApiTags('catalogs')
@Controller()
export class CatalogsController {
    constructor(private readonly catalogservice:CatalogsService){}

    @Get('products')
    findAllProducts(@Query() qurey:ProductQueryDto ){
        return this.catalogservice.findAllProducts(qurey)
    }
    @Get('products/:id')
    findOneproduct(@Param("id")id: string){
        return this.catalogservice.findOneProduct(id)
    }

      @Get('categories')
      findallCategories() {
       return this.catalogservice.findallCategories();
    }
       @ApiOperation({ summary: 'Create a new category (admin only)' })
       @ApiBearerAuth()
       @ApiResponse({ status: 201, description: 'category created successfully' })
       @ApiResponse({ status: 409, description: 'category with this name already exists' })
       @UseGuards(AuthGuard, RolesGuard)
       @Roles('admin')
       @Post('categories')
       createcatogry(@Body() dto: CreateCategoryDto) {
         return this.catalogservice.createcatogry(dto);
    }
       @ApiOperation({ summary: 'Create a new product (admin only)' })
       @ApiBearerAuth()
       @ApiResponse({ status: 201, description: 'Product created successfully' })
       @ApiResponse({ status: 409, description: 'Product with this name already exists' })
       @UseGuards(AuthGuard, RolesGuard)
       @Roles('admin')
       @Post('products')
       createProduct(@Body() dto: ProductDto) {
         return this.catalogservice.createproduct(dto);
    }
        @ApiOperation({ summary: 'Update a product (admin only)' })
        @ApiBearerAuth()
        @ApiResponse({ status: 201, description: 'Product updated successfully' })
        @ApiResponse({ status: 409, description: 'Product with this name already exists' })
        @UseGuards(AuthGuard, RolesGuard)
        @Roles('admin')
        @Patch('Products/:id')
        updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
             return this.catalogservice.updateProduct(id, dto);
    }
          @UseGuards(AuthGuard, RolesGuard)
          @Roles('admin')
          @Delete('products/:id')
          removeProduct(@Param('id') id: string) {
          return this.catalogservice.removeProduct(id);
  }
}
