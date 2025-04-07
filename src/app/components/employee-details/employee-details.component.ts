import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { APOLLO_CLIENT } from '../../apollo.config';
import { ApolloClient } from '@apollo/client/core';
import { GET_EMPLOYEE_BY_ID } from '../../graphql/employee.graphql';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit {
  employee: any;
  private apollo = inject<ApolloClient<any>>(APOLLO_CLIENT);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    }
  }

  async loadEmployee(id: string) {
    try {
      const result = await this.apollo.query({
        query: GET_EMPLOYEE_BY_ID,
        variables: { id },
      });
      this.employee = result.data.searchEmployeeById;
    } catch (error: any) {
      this.snackBar.open('Error loading employee: ' + error.message, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}