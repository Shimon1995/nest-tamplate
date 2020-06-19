import { Document } from 'mongoose';

import { ERoles } from '../enums/roles.enum';
import { EStatus } from '../enums/status.enum';

export interface IUser extends Document {
  fullName: string;
  email: string;
  status: EStatus;
  roles: [ERoles];
  password: string;
}
