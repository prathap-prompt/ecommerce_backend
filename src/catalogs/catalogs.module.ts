import { Module } from '@nestjs/common';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from './catalogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/categories';
import { Product } from 'src/entities/product';

@Module({
  imports:[TypeOrmModule.forFeature([Category,Product])],
  controllers: [CatalogsController],
  providers: [CatalogsService]
})
export class CatalogsModule {}
