import { Component, OnInit } from '@angular/core';
import { Apollo } from '@apollo/client/core';
import { GET_ALL_EMPLOYEES, DELETE_EMPLOYEE } from '../graphql/employee.graphql';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink], // Import necessary modules
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];

  constructor(
    private apollo: Apollo,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
      } else {
        this.loadEmployees();
      }
    });
  }

  loadEmployees() {
    this.apollo
      .query({ query: GET_ALL_EMPLOYEES })
      .subscribe((result: any) => {
        this.employees = result.data.getAllEmployees;
      });
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apollo
        .mutate({
          mutation: DELETE_EMPLOYEE,
          variables: { id },
          refetchQueries: [{ query: GET_ALL_EMPLOYEES }],
        })
        .subscribe(() => {
          alert('Employee deleted successfully');
        });
    }
  }
}