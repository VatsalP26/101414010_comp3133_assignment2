import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <span class="logo">Employee Management</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/employees" routerLinkActive="active" *ngIf="isLoggedIn$ | async">Employees</a>
      <a mat-button routerLink="/employee/add" routerLinkActive="active" *ngIf="isLoggedIn$ | async">Add Employee</a>
      <a mat-button routerLink="/employee/search" routerLinkActive="active" *ngIf="isLoggedIn$ | async">Search Employees</a>
      <button mat-button (click)="logout()" *ngIf="isLoggedIn$ | async">Logout</button>
      <a mat-button routerLink="/login" *ngIf="!(isLoggedIn$ | async)">Login</a>
      <a mat-button routerLink="/signup" *ngIf="!(isLoggedIn$ | async)">Signup</a>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      padding: 0 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background: linear-gradient(90deg, #1976d2, #42a5f5);
    }

    .logo {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    a[mat-button], button[mat-button] {
      margin: 0 10px;
      font-size: 16px;
      color: #ffffff;
      transition: color 0.3s ease, transform 0.2s ease;

      &.active {
        color: #ffca28; // Accent color
        font-weight: 500;
      }

      &:hover {
        color: #ffca28;
        transform: translateY(-2px);
      }
    }
  `],
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    console.log('AppComponent initialized');
  }

  ngOnInit(): void {
    console.log('AppComponent ngOnInit'); 
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  logout() {
    console.log('Logging out'); 
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}