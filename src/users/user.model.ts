import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  Model,
  Sequelize,
  Table
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/user-roles.model";
import { Post } from "../posts/post.model";

interface  UserCreationAttrs {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  deletedAt: Date;
}

@Table({tableName: `users`})
export class User extends  Model<User, UserCreationAttrs> {

  @ApiProperty({example: `1`, description: `Unique id`})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: `Maxim`, description: `User name`})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  name: string;

  @ApiProperty({example: `user@mail.ru`, description: `User mail`})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  email: string;

  @ApiProperty({example: `12345`, description: `User password`})
  @Column({type: DataType.STRING, allowNull: false})
  password: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;

  @ApiProperty({example: `true`, description: `User banned or not`})
  @Column({type: DataType.BOOLEAN, defaultValue: false})
  banned: boolean;

  @ApiProperty({example: `Spam`, description: `Reason of ban`})
  @Column({type: DataType.STRING, allowNull: true})
  banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Post)
  post: Post[];
}

