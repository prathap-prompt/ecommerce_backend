import { Controller,Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req, } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/reviewdto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get('products/:productId/reviews')
  findForProduct(@Param('productId') productId: string) {
    return this.reviewsService.findForProduct(productId);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('products/:productId/reviews')
  create(
    @Req() req,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(req.user.id, productId, dto);
  }
   @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('reviews/:id')
  remove(@Req() req, @Param('id') id: string) {
    return this.reviewsService.remove(req.user.id, id);
  }


    
}
