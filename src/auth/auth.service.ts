import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { passwordHashing } from './utils/hashPassword.utils';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService) { }

  async register(createUserDto: CreateUserDto): Promise<string> {
    try {
      createUserDto.password = await passwordHashing.generateHash(createUserDto.password)
      const createdUser = new this.userModel(createUserDto);
      const user = await createdUser.save();
      const payload = { id: user._id, email: user.email, role: user.role };
      const jwtAccessToken = this.jwtService.sign(payload);
      return jwtAccessToken;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(reqUser: LoginUserDto): Promise<string> {
    const user = await this.userModel.findOne({ email: reqUser.email, role: reqUser.role })
    if (user) {
      const isPasswordCorrect = await passwordHashing.comparePassword(reqUser.password, user.password);
      if (isPasswordCorrect) {
        const payload = { id: user._id, email: user.email, role: user.role };
        const jwtAccessToken = this.jwtService.sign(payload);
        return jwtAccessToken;
      }
      throw new NotFoundException("Invalid Email, password or role");
    }
    throw new NotFoundException("Invalid Email, password or role");
  }

}
