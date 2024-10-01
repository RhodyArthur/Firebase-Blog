import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink, RouterLinkActive
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  errorMessage: string | null = null;
  isLoading: boolean = false;
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService) {

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required]]
    },
    {validators: this.passwordMatchValidator})
  }

   // check if password match
   passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('repeatPassword')?.value
        ? null : { 'mismatch': true };
    }

  onSubmit() {
    if(this.registerForm.valid) {

      const { email, username,  password } = this.registerForm.getRawValue();

      this.isLoading = true;

      this.authService.register(email, username, password)
        .subscribe({
          next: () => {
              this.router.navigate(['login']);
              this.isLoading = false;
              this.errorMessage = null;
          },
          error: err => {
            this.isLoading = false;
            this.errorMessage = err.code + ' Failed to register user';
            console.error('Failed to register user', err);
          }
      })
      // reset form
      this.registerForm.reset();
    }
  }
}
