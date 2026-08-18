// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { userDto } from '../auth/dto/user.dto';
// import { UsersService } from './users.service';

// @Controller('api')
// export class UsersController {
//     constructor(private readonly userservices:UsersService){}

//     @Post('user')
//     async createuser(@Body() userDto:userDto) {
//         return this.userservices.createuser(userDto)
        
//     }
//     @Get('email')
//     async getUserbyemail()  {
//         // This endpoint needs a query parameter. Add it if needed:
//         // @Query('email') email: string
//         // return this.userservices.getUserbyemail(email);
//         return { message: 'Please provide email as query parameter' };
//     }
// }
