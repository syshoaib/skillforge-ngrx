import { createEntityAdapter } from '@ngrx/entity';
import { User } from '../../models/user.model';

export const userAdapter = createEntityAdapter<User>();
