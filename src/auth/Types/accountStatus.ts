import mongoose from 'mongoose';
import { UserRoles } from './roles';

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export class UserAccount {
  id: mongoose.Schema.Types.ObjectId;
  role: UserRoles;
  department: mongoose.Schema.Types.ObjectId;
}
