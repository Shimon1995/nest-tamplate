import { ERoles } from '../enums/roles.enum';
import { EStatus } from '../enums/status.enum';

export interface IReadableUser {
  readonly fullName: string;
  readonly email: string;
  readonly status: EStatus;
  readonly roles: Array<ERoles>;
  token: string;
}
