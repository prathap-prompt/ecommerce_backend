import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Category } from 'src/entities/categories';
import { Product } from 'src/entities/product';
import { CreateCategoryDto} from './dtos/catogeriesDto';
import {ProductDto} from './dtos/productsDto'
import { UpdateProductDto} from './dtos/updateproductDto';
import { ProductQueryDto } from './dtos/productqueryDto';



@Injectable()
export class CatalogsService {
    constructor(@InjectRepository(Category)
    private categoryRepo:Repository<Category>,
    @InjectRepository(Product)
    private productRepo:Repository<Product>){}

    private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
      }

      async createcatogry(dto:CreateCategoryDto):Promise<Category>{
        const slug=this.slugify(dto.name);
        const existing=await this.categoryRepo.findOneBy({slug})
        if(existing){
            throw new ConflictException("category with this name already exists ")
        }
        const category = this.categoryRepo.create({ ...dto, slug });
        return this.categoryRepo.save(category);
      }

      async findallCategories():Promise<Category[]>{
        return this.categoryRepo.find()
      }

      async createproduct(dto:ProductDto):Promise<Product>{
        const slug=this.slugify(dto.name);
        const existing = await this.productRepo.findOneBy({ slug } as any);
        if(existing){
            throw new ConflictException('product with this name already exists');
        }
        if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }
     const product = this.productRepo.create({ ...dto, slug } as Partial<Product>);
       return this.productRepo.save(product);
      }

      async findAllProducts(query: ProductQueryDto) {
    const { search, categoryId, page, limit } = query;

    const [items, total] = await this.productRepo.findAndCount({
      where: {
        isActive: true,
        ...(search && { name: ILike(`%${search}%`) }),
        ...(categoryId && { categoryId }),
      },
      relations: { category: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const mappedItems = items.map((product) => ({
      ...product,
      price: Number(product.basePrice || 0),
    }));

    return {
      items: mappedItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

   async findOneProduct(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      ...product,
      price: Number(product.basePrice || 0),
    } as any;
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOneProduct(id);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }
   async removeProduct(id: string): Promise<void> {
    const product = await this.findOneProduct(id);
    product.isActive = false; // soft delete
    await this.productRepo.save(product);
  }
}
