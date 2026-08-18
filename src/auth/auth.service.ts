import { ConflictException, Injectable, UnauthorizedException,BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import  crypto from 'crypto';
import { CreateUserDto } from '../auth/dto/registeruserdto';
import { LoginUserDto } from './dto/loginuserdto';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from 'src/entities/passwordreset';
import { ResetPasswordDto } from 'src/auth/dto/reset_passworddto';
import { ForgotPasswordDto } from 'src/auth/dto/forgot_passworddto';
import { users } from 'src/entities/users.entity';

import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';



@Injectable()
export class AuthService {
    
     constructor(private readonly usersService: UsersService,
        private readonly jwtservice: JwtService,

        @InjectRepository(users)
        private readonly userRepo: Repository<users>,

        @InjectRepository(PasswordResetToken)
        private readonly resetTokenRepo: Repository<PasswordResetToken>,

     ) {}

    async register(dto: CreateUserDto) {
        const existing = await this.usersService.getUserbyemail(dto.email);
        if (existing) {
            throw new ConflictException('email already exists');
        }

        const saltRounds = 10;
        const hashed = await bcrypt.hash(dto.password, saltRounds);

        const user = await this.usersService.createuser({
            ...dto,
            password: hashed,
        });
        const payload = { sub: user.id, id: user.id, email: user.email, role: user.role };
        const token = await this.jwtservice.signAsync(payload);
        return { 
            access_token: token,
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.full_name,
                role: user.role,
            },
        };
    }

    async login(dto: LoginUserDto) {
        const user = await this.usersService.getUserbyemail(dto.email);
        if (!user) {
            throw new UnauthorizedException("email or password is invalid");
        }

        const validate = await bcrypt.compare(dto.password, user.password);
        if (!validate) {
            throw new UnauthorizedException("email or password is invalid");
        }
        const payload = { sub: user.id, id: user.id, email: user.email, role: user.role };
        const token = await this.jwtservice.signAsync(payload);
        return { 
            access_token: token,
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.full_name,
                role: user.role,
            },
        };
    }
    async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
   const user = await this.userRepo.findOne({ where: { email: dto.email } });

  // IMPORTANT: always return the same generic message, whether or not the
  // email exists. Otherwise this endpoint becomes a way to check which
  // emails are registered ("user enumeration") — a real security leak.
  const genericResponse = {
    message: 'If an account exists for this email, a reset link has been sent.',
  };

  if (!user) {
    return genericResponse;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const resetToken = new PasswordResetToken();
  resetToken.userId = user.id;
  resetToken.tokenHash = tokenHash;
  resetToken.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await this.resetTokenRepo.save(resetToken);

  // STUB: replace this with a real email send (Resend/SendGrid/SES) later.
  // The raw token must go out over email ONLY — never returned in the API
  // response in production, since that defeats the entire point.
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
  console.log(`[DEV ONLY] Password reset link for ${user.email}: ${resetLink}`);

  return genericResponse;
 }

 async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
  const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

  const resetToken = await this.resetTokenRepo.findOne({
    where: { tokenHash },
  });

  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    throw new BadRequestException('Invalid or expired reset token');
  }

  const user = await this.userRepo.findOne({ where: { id: resetToken.userId } });
  if (!user) {
    throw new BadRequestException('Invalid or expired reset token');
  }

  user.password = await bcrypt.hash(dto.newPassword, 10);
  await this.userRepo.save(user);

  resetToken.used = true;
  await this.resetTokenRepo.save(resetToken);

  return { message: 'Password has been reset successfully.' };

  }

    
        
    
  
  



}
