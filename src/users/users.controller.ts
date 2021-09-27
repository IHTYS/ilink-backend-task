import {
  Body,
  Controller, Delete,
  Get,
  NotFoundException,
  Param,
  Post, Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./user.model";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles-guard";
import { AddRole } from "./dto/add-role";
import { BanUserDto } from "./dto/ban-user.dto";

@ApiTags(`Users`)
@Controller('/users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @ApiOperation({summary: `User create`})
  @ApiResponse({status: 200, type: User})
  @UsePipes(ValidationPipe)
  @Post(`create`)
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({summary: `Get user by id`})
  @ApiResponse({status: 200, type: User})
  @UsePipes(ValidationPipe)
  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @ApiOperation({ summary: `Get user by name` })
  @ApiResponse({ status: 200, type: User })
  @UsePipes(ValidationPipe)
  @Get(`getByName/:name`)
  getUserByName(@Param('name') name: string) {
    return this.usersService.getUserByName(name);
  }

  @ApiOperation({summary: `Get all users`})
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @ApiOperation({summary: `Update user by id`})
  @Put(':id')
  async update(@Param('id') id: number, @Body() userDto: CreateUserDto): Promise<CreateUserDto> {
    const { numberOfAffectedRows, updatedUser } = await this.usersService.update(id, userDto);
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException('This User doesn\'t exist');
    }
    return updatedUser;
  }

  @ApiOperation({summary: `Delete user by id`})
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const deleted = await this.usersService.delete(id);
    if (deleted === 0) {
      throw new NotFoundException('This User doesn\'t exist');
    }
    return 'Successfully deleted';
  }

  @ApiOperation({summary: `Return all users`})
  @ApiResponse({status: 200, type: [User]})
  // @UseGuards(JwtAuthGuard)
  @Roles(`ADMIN`)
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({summary: `Get role`})
  @ApiResponse({status: 200})
  @Roles(`ADMIN`)
  @UseGuards(RolesGuard)
  @Post(`/role`)
  addRole(@Body() dto: AddRole) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({summary: `Ban user`})
  @ApiResponse({status: 200})
  @Roles(`ADMIN`)
  @UseGuards(RolesGuard)
  @Post(`/ban`)
  ban(@Body() dto: BanUserDto) {
    return this.usersService.ban(dto);
  }
}
