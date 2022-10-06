import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto } from './dto/index.dto';
import { User, UserDocument } from './schema/user.schema';
import { passwordHashing } from "./utils/hashPassword.utils";

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.password = await passwordHashing.generateHash(createUserDto.password)
      const createdUser = new this.userModel(createUserDto);
      const user = await createdUser.save();
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(reqUser: LoginUserDto): Promise<User> {
    const user = await this.userModel.findOne({ email: reqUser.email, role: reqUser.role })
    if (user) {
      const isPasswordCorrect = await passwordHashing.comparePassword(reqUser.password, user.password);
      if (isPasswordCorrect) {
        return user;
      }
      throw new NotFoundException("Invalid Email, password or role");
    }
    throw new NotFoundException("Invalid Email, password or role");
  }

}
