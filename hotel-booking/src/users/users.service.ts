import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './create-user.dto';
import { IUserService, SearchUserParams } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return user; // Если пользовател найден и пароль совпадает
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, role: user.role }; // Добавляем нужные данные на проверки
    return {
      access_token: this.jwtService.sign(payload), // Генерация токена
    };
  }

  findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async create(userDetails: CreateUserDto): Promise<UserDocument> {
    const passwordHash = await bcrypt.hash(userDetails.password, 10);
    const createdUser = new this.userModel({ ...userDetails, passwordHash });
    return createdUser.save();
  }

  async findAll(params: SearchUserParams): Promise<UserDocument[]> {
    const { limit, offset, email, name, contactPhone } = params;
    const query: any = {};
    if (email) query.email = { $regex: email, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };
    if (contactPhone)
      query.contactPhone = { $regex: contactPhone, $options: 'i' };

    return this.userModel.find(query).limit(limit).skip(offset).exec();
  }
}
