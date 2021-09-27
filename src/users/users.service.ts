import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";
import { AddRole } from "./dto/add-role";
import { BanUserDto } from "./dto/ban-user.dto";

@Injectable()
export class UsersService {

  constructor(@InjectModel(User) private  userRepository: typeof User,
              private  roleService: RolesService) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue(`ADMIN`);
    await user.$set(`roles`, [role.id]);
    user.roles = [role];
    return user;
  }

  async findOneById(id): Promise<CreateUserDto> {
    return await this.userRepository.findOne({ where: { id } });
    // return await this.userRepository.findOne<User>({
    //   where: { id },
    //   include: [{ model: User, attributes: { exclude: ['password'] } }],
    // });
  }

  async getUserByName(name: string) {
    const users =await this.userRepository.findOne({where: {name}, include: {all: true}});
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll<User>({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async delete(id) {
    return await this.userRepository.destroy({ where: { id} });
  }

  async update(id, data) {
    const [numberOfAffectedRows, [updatedUser]] = await this.userRepository.update({ ...data }, { where: { id}, returning: true });

    return { numberOfAffectedRows, updatedUser };
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({include: {all: true}});
    return users;
  }


  async addRole(dto: AddRole) {
    const  user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$add(`role`, role.id);
      return dto;
    }
    throw new HttpException(`User or role not found`, HttpStatus.NOT_FOUND)
    }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    if(!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND)
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}
