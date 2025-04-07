import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideApollo } from './app/apollo.config';
import { AuthService } from './app/services/auth.service';
import { AuthGuard } from './app/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./app/components/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./app/components/signup/signup.component').then(m => m.SignupComponent) },
  { 
    path: 'employees', 
    loadComponent: () => import('./app/components/employee-list/employee-list.component').then(m => m.EmployeeListComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employee/add', 
    loadComponent: () => import('./app/components/employee-add/employee-add.component').then(m => m.EmployeeAddComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employee/details/:id', 
    loadComponent: () => import('./app/components/employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employee/edit/:id', 
    loadComponent: () => import('./app/components/employee-edit/employee-edit.component').then(m => m.EmployeeEditComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employee/search', 
    loadComponent: () => import('./app/components/employee-search/employee-search.component').then(m => m.EmployeeSearchComponent), 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/login' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    provideApollo(),
    AuthService,
  ],
}).catch((err) => console.error(err));