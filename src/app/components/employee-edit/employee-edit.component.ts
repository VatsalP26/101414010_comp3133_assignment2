import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from '@apollo/client/core';
import { GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE } from '../graphql/employee.graphql';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  employee: any;
  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1000)]],
      department: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apollo
        .query({
          query: GET_EMPLOYEE_BY_ID,
          variables: { id },
        })
        .subscribe((result: any) => {
          this.employee = result.data.searchEmployeeById;
          this.employeeForm.patchValue(this.employee);
        });
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      const variables = {
        id,
        ...this.employeeForm.value,
        salary: parseFloat(this.employeeForm.value.salary),
        file: this.file,
      };

      this.apollo
        .mutate({
          mutation: UPDATE_EMPLOYEE,
          variables,
          context: {
            useMultipart: true,
          },
        })
        .subscribe(
          () => {
            alert('Employee updated successfully');
            this.router.navigate(['/employees']);
          },
          (error) => {
            console.error('Error updating employee:', error);
            alert('Error updating employee: ' + error.message);
          }
        );
    }
  }
}