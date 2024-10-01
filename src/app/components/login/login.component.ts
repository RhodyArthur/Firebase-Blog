import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  errorMessage: string | null = null;
  isLoading: boolean = false;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })

  }


  onSubmit(): void {
    if(this.loginForm.valid) {

      const {email, password} = this.loginForm.getRawValue();

      this.isLoading = true;
  
      this.authService.login(email, password)
      .subscribe({
        next: () => {
        this.router.navigate(['/']);
        this.isLoading = false;
        this.errorMessage = null;
      },

      error: err => {
        console.error(err);
        this.errorMessage = err.code + ' Unable to login';
        this.isLoading = false;
      }
    })
    }
  }

  // log in with google
  onGoogleSignIn() {
    this.isLoading = true;

    this.authService.googleSignIn()
    .subscribe({
      next: (user: User) => {
        // store data in local storage
        // const username = user.displayName;
        // const email = user.email;

        // if (username && email) {
        //   this.userService.setUserData(username, email);
        // }

        this.router.navigate(['/']);
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.code + ' Google Authentication failed';
        console.error(this.errorMessage);
        this.isLoading = false;
      }
    })
  }
}
