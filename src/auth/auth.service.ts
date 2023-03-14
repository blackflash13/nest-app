import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../users/user.model";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return await this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate)
      throw new HttpException("User is exist", HttpStatus.BAD_REQUEST);

    const hashPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const pwdEquals = await bcrypt.compare(userDto.password, user.password);
    if (user && pwdEquals) return user;

    // throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    throw new UnauthorizedException("Wrong email or password");
  }
}
