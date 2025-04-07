import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router';
import { APOLLO_CLIENT } from '../../apollo.config';
import { ApolloClient } from '@apollo/client/core';
import { ADD_EMPLOYEE } from '../../graphql/employee.graphql';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss'],
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  private apollo = inject<ApolloClient<any>>(APOLLO_CLIENT);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor() {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
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

  async onSubmit(): Promise<void> {
    if (this.employeeForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const employeeInput = {
      ...this.employeeForm.value,
      salary: parseFloat(this.employeeForm.value.salary),
      date_of_joining: this.employeeForm.value.date_of_joining.toISOString(),
      employee_photo: this.selectedFile,
    };

    try {
      const result = await this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: { input: employeeInput },
        context: {
          useMultipart: true, // Required for file uploads
        },
      });

      this.snackBar.open('Employee added successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
      this.router.navigate(['/employees']);
    } catch (error: any) {
      this.snackBar.open('Error adding employee: ' + error.message, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}