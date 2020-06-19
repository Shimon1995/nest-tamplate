import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { hash, genSalt } from 'bcrypt';
import { assignIn } from 'lodash';

import { IUser } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { EStatus } from 'src/user/enums/status.enum';
import { ERoles } from 'src/user/enums/roles.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async add(userDto: CreateUserDTO): Promise<IUser> {
    const salt = await genSalt(10);
    const password = await hash(userDto.password, salt);

    const status = EStatus.pending;
    const roles = [ERoles.guest];

    return new this.userModel(
      assignIn<IUser>(userDto, { password, roles, status }),
    ).save();
  }

  find(_id: string): Promise<IUser> {
    return this.userModel.findById(_id).exec();
  }

  findByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email }).exec();
  }
}
