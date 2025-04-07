import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LOGIN } from '../../graphql/auth.graphql';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APOLLO_CLIENT } from '../../apollo.config';
import { ApolloClient } from '@apollo/client/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private apollo = inject<ApolloClient<any>>(APOLLO_CLIENT);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  constructor() {
    console.log('LoginComponent initialized'); // Debug log
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('LoginComponent ngOnInit'); // Debug log
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Submitting login with:', { email, password }); // Debug log
      try {
        const result = await this.apollo.mutate({
          mutation: LOGIN,
          variables: { email, password },
        });
        console.log('Login result:', result); // Debug log
        const token = result.data?.login.token;
        if (token) {
          this.authService.setToken(token);
          this.router.navigate(['/employees']);
        } else {
          this.snackBar.open('Login failed: No token returned', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
      } catch (error: any) {
        console.error('Login error:', error); // Debug log
        this.snackBar.open(error.message || 'Login failed', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    }
  }
}