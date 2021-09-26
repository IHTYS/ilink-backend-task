import { IsNumber, IsString } from "class-validator";

export class AddRole {
  @IsString({message: `Must be string`})
  readonly value: string;

  @IsNumber({}, {message: `Must be number`})
  readonly userId: number;
}