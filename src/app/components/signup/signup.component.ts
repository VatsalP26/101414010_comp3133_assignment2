import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from '@apollo/client/core';
import { SIGNUP } from '../graphql/auth.graphql';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      this.apollo
        .mutate({
          mutation: SIGNUP,
          variables: { username, email, password },
        })
        .subscribe(
          () => {
            alert('Signup successful! Please login.');
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Signup failed:', error);
            alert('Signup failed: ' + error.message);
          }
        );
    }
  }
}