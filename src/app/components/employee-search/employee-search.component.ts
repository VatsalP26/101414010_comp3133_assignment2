import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { APOLLO_CLIENT } from '../../apollo.config';
import { ApolloClient } from '@apollo/client/core';
import { SEARCH_EMPLOYEES } from '../../graphql/employee.graphql';

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.scss'],
})
export class EmployeeSearchComponent implements OnInit {
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'designation',
    'department',
  ];
  employees: any[] = [];
  private apollo = inject<ApolloClient<any>>(APOLLO_CLIENT);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  constructor() {
    this.searchForm = this.fb.group({
      designation: [''],
      department: [''],
    });
  }

  ngOnInit(): void {}

  async onSearch() {
    const { designation, department } = this.searchForm.value;
    try {
      const result = await this.apollo.query({
        query: SEARCH_EMPLOYEES,
        variables: { designation: designation || undefined, department: department || undefined },
      });
      this.employees = result.data.searchEmployeeByDesignationOrDepartment;
    } catch (error: any) {
      this.snackBar.open('Error searching employees: ' + error.message, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}