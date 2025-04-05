import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from '@apollo/client/core';
import { ADD_EMPLOYEE } from '../graphql/employee.graphql';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss'],
})
export class EmployeeAddComponent implements OnInit {
  employeeForm: FormGroup;
  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const variables = {
        ...this.employeeForm.value,
        salary: parseFloat(this.employeeForm.value.salary),
        date_of_joining: this.employeeForm.value.date_of_joining.toISOString(),
        file: this.file,
      };

      this.apollo
        .mutate({
          mutation: ADD_EMPLOYEE,
          variables,
          context: {
            useMultipart: true, // Required for file uploads
          },
        })
        .subscribe(
          () => {
            alert('Employee added successfully');
            this.router.navigate(['/employees']);
          },
          (error) => {
            console.error('Error adding employee:', error);
            alert('Error adding employee: ' + error.message);
          }
        );
    }
  }
}