import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "user@gmail.com", description: "User email" })
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Wrong email" })
  readonly email: string;

  @IsString({ message: "Password must be a string" })
  @Length(4, 32, {
    message: "Min length of a password must be 4 symbols, max 32 symbols",
  })
  @ApiProperty({ example: "123456", description: "User password" })
  readonly password: string;
}