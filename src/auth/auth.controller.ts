import { Controller, Get, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../auth/dto/registeruserdto';
import { LoginUserDto } from './dto/loginuserdto';
import { Throttle } from '@nestjs/throttler';
import { ResetPasswordDto } from 'src/auth/dto/reset_passworddto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot_passworddto';

@Controller('api')
export class AuthController {
    constructor(private readonly AuthServices: AuthService) {}

    // @Get('email')
    // async getuserbyEmail(@Body() createUserDto: CreateUserDto) {
    //     return await this.AuthServices.register(createUserDto);
    
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post('register')
     
    async register(@Body() dto: CreateUserDto){
        return this.AuthServices.register(dto)
    }
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('login')
    async login(@Body() dto: LoginUserDto){
        return await this.AuthServices.login(dto)
    }

    @Throttle({ default: { limit: 3, ttl: 60000 } }) // same reasoning as login: prevent abuse
@Post('forgot-password')
forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.AuthServices.forgotPassword(dto);
}

@Throttle({ default: { limit: 5, ttl: 60000 } })
@Post('reset-password')
resetPassword(@Body() dto: ResetPasswordDto) {
  return this.AuthServices.resetPassword(dto);
}

}
    
