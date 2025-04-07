import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { APOLLO_CLIENT } from '../../apollo.config';
import { ApolloClient } from '@apollo/client/core';
import { GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE } from '../../graphql/employee.graphql';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string | null = null;
  employee: any;
  selectedFile: File | null = null; // Add property to store the selected file
  private apollo = inject<ApolloClient<any>>(APOLLO_CLIENT);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  constructor() {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
      // Remove file from form control since we'll handle it separately
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.loadEmployee(this.employeeId);
    }
  }

  async loadEmployee(id: string) {
    try {
      const result = await this.apollo.query({
        query: GET_EMPLOYEE_BY_ID,
        variables: { id },
      });
      this.employee = result.data.searchEmployeeById;
      this.employeeForm.patchValue({
        first_name: this.employee.first_name,
        last_name: this.employee.last_name,
        email: this.employee.email,
        gender: this.employee.gender,
        designation: this.employee.designation,
        salary: this.employee.salary,
        date_of_joining: new Date(this.employee.date_of_joining),
        department: this.employee.department,
      });
    } catch (error: any) {
      this.snackBar.open('Error loading employee: ' + error.message, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size exceeds 5MB limit', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        this.selectedFile = null;
        input.value = ''; // Reset the file input
        return;
      }
      // Validate file type (jpg or png)
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        this.snackBar.open('Only JPG and PNG files are allowed', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        this.selectedFile = null;
        input.value = ''; // Reset the file input
        return;
      }
      this.selectedFile = file;
    }
  }

  async onSubmit() {
    if (this.employeeForm.valid && this.employeeId) {
      const employeeInput = {
        ...this.employeeForm.value,
        salary: parseFloat(this.employeeForm.value.salary),
        date_of_joining: this.employeeForm.value.date_of_joining.toISOString(),
        employee_photo: this.selectedFile, // Use the selected file
      };

      try {
        const result = await this.apollo.mutate({
          mutation: UPDATE_EMPLOYEE,
          variables: {
            id: this.employeeId,
            input: employeeInput, // Pass as input object
          },
          context: {
            useMultipart: true, // Required for file uploads
          },
        });
        this.snackBar.open('Employee updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/employees']);
      } catch (error: any) {
        this.snackBar.open('Error updating employee: ' + error.message, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    }
  }
}