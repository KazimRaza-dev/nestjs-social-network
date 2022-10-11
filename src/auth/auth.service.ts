import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsGateway } from 'src/events/events.gateway';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { passwordHashing } from './utils/hashPassword.utils';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private eventGateway: EventsGateway
  ) { }

  /**
   * Register a new user And return JWT token to that user
   * 
   * @param createUserDto User object passed in request body
   * @returns JWT token if the user successfully registered
   */
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

  /**
   * Check if log-in credientials are valid or not. If user successfully logged in then return a JWT token
   * 
   * @param reqUser Request object that contains email, password and role passed by user  
   * @returns JWT token if user successfully logged In
   */
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
