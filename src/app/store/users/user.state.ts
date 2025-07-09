import { EntityState } from '@ngrx/entity';
import { User } from '../../models/user.model';

export interface UserState extends EntityState<User> {}
