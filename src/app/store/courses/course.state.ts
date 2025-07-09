import { EntityState } from '@ngrx/entity';
import { Course } from '../../models/course.model';

export interface CourseState extends EntityState<Course> {}
