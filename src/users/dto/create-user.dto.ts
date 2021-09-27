import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {

  @ApiProperty({example: `Maxim`, description: `User name`})
  @IsString({message: `Must be string`})
  @Length(1, 20, )
  readonly name: string;

  @ApiProperty({example: `user@mail.ru`, description: `Mail`})
  @IsString({message: `Must be string`})
  @IsEmail({},{message: `Uncorrect email`})
  readonly email: string;

  @ApiProperty({example: `12345`, description: `Password`})
  @IsString({message: `Must be string`})
  @Length(4, 20, {message: `Password must be not less then 4 and not max then 20`})
  readonly password: string;
}