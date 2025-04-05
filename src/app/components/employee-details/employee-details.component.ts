import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from '@apollo/client/core';
import { GET_EMPLOYEE_BY_ID } from '../graphql/employee.graphql';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit {
  employee: any;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo
  ) {}

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
        });
    }
  }
}