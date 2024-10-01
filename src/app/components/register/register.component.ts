import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router) {
  }

    registerForm = this.fb.nonNullable.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })

  onSubmit() {
    const rawForm = this.registerForm.getRawValue();
    this.authService.register(rawForm.email, rawForm.username, rawForm.password)
      .subscribe(() => {
        this.router.navigate(['/'])
      })
    console.log('clicked')
  }
}
