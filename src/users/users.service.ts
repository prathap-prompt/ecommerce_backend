import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/registeruserdto';
import { users } from '../entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(users)
        private usersRepository: Repository<users>
    ) {}

    async createuser(userDto: CreateUserDto) {
        const user = this.usersRepository.create({
            // map DTO `name` to entity `full_name`
            full_name: userDto.name,
            email: userDto.email,
            password: userDto.password,
            phone: userDto.phone || '0000000000',
            role: userDto.role || 'customer',
        });
        return await this.usersRepository.save(user);
    }

    async getUserbyemail(email: string) {
        return await this.usersRepository.findOne({ where: { email } });
    }
}
