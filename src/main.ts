import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideApollo } from './app/apollo.config';
import { AuthService } from './app/services/auth.service';
import { LoginComponent } from './app/components/login/login.component';
import { SignupComponent } from './app/components/signup/signup.component';
import { EmployeeListComponent } from './app/components/employee-list/employee-list.component';
import { EmployeeAddComponent } from './app/components/employee-add/employee-add.component';
import { EmployeeDetailsComponent } from './app/components/employee-details/employee-details.component';
import { EmployeeEditComponent } from './app/components/employee-edit/employee-edit.component';
import { EmployeeSearchComponent } from './app/components/employee-search/employee-search.component';
import { AuthGuard } from './app/guards/auth.guard';

// routes 
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: 'employee/add', component: EmployeeAddComponent, canActivate: [AuthGuard] },
  { path: 'employee/details/:id', component: EmployeeDetailsComponent, canActivate: [AuthGuard] },
  { path: 'employee/edit/:id', component: EmployeeEditComponent, canActivate: [AuthGuard] },
  { path: 'employee/search', component: EmployeeSearchComponent, canActivate: [AuthGuard] },
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