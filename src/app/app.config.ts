import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideEntityData } from '@ngrx/data';
import { userReducer } from './store/users/user.reducer';
import { courseReducer } from './store/courses/course.reducer';
import { CourseEffects } from './store/courses/course.effect';
import { UserEffects } from './store/users/user.effect';
import { entityConfig } from './entity-metadata';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ users: userReducer, courses: courseReducer }),
    provideEffects([UserEffects, CourseEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideEntityData(entityConfig),
    provideHttpClient(),
  ],
};
