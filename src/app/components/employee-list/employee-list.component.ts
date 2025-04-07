import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { APOLLO_CLIENT } from '../../apollo.config';
import { ApolloClient } from '@apollo/client/core';
import { GET_EMPLOYEES, DELETE_EMPLOYEE } from '../../graphql/employee.graphql';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'designation',
    'department',
    'actions',
  ];
  employees: any[] = [];
  private apollo = inject<ApolloClient<any>>(APOLLO_CLIENT);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadEmployees();
  }

  async loadEmployees() {
    try {
      const result = await this.apollo.query({
        query: GET_EMPLOYEES,
        fetchPolicy: 'network-only',
      });
      this.employees = result.data.getAllEmployees;
    } catch (error: any) {
      this.snackBar.open('Error loading employees: ' + error.message, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  viewEmployee(id: string) {
    this.router.navigate([`/employee/details/${id}`]);
  }

  editEmployee(id: string) {
    this.router.navigate([`/employee/edit/${id}`]);
  }

  async deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        const result = await this.apollo.mutate({
          mutation: DELETE_EMPLOYEE,
          variables: { id },
          refetchQueries: [{ query: GET_EMPLOYEES }],
        });
        this.snackBar.open('Employee deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      } catch (error: any) {
        this.snackBar.open('Error deleting employee: ' + error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    }
  }
}