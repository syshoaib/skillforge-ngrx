import { createEntityAdapter } from '@ngrx/entity';
import { Course } from '../../models/course.model';

export const courseAdapter = createEntityAdapter<Course>();
