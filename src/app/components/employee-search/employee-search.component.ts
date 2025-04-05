import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Apollo } from '@apollo/client/core';
import { SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT } from '../graphql/employee.graphql';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.scss'],
})
export class EmployeeSearchComponent implements OnInit {
  searchForm: FormGroup;
  employees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo
  ) {
    this.searchForm = this.fb.group({
      designation: [''],
      department: [''],
    });
  }

  ngOnInit(): void {}

  onSearch() {
    const { designation, department } = this.searchForm.value;
    this.apollo
      .query({
        query: SEARCH_EMPLOYEE_BY_DESIGNATION_OR_DEPARTMENT,
        variables: { designation: designation || null, department: department || null },
      })
      .subscribe((result: any) => {
        this.employees = result.data.searchEmployeeByDesignationOrDepartment;
      });
  }
}