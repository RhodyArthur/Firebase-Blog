import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { updateProfile, User } from '@angular/fire/auth';

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
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService) {

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required]],
      profilePicture: ['']
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
          next: (user) => {
            this.updateUserProfile(user, username);
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

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      // Check file size (1MB = 1048576 bytes)
      const maxSize = 1048576;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (file.size > maxSize) {
        this.errorMessage = 'File size must be less than 1MB.';
        this.selectedFile = null;
      } else if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only image files (JPEG, PNG, GIF) are allowed.';
        this.selectedFile = null;
      } else {
        this.errorMessage = null;
        this.selectedFile = file;
      }
    }
  }

  // update profile with image
  updateUserProfile(user: User, username: string) {
    if (this.selectedFile) {
      this.authService
        .uploadProfilePicture(this.selectedFile, user)
        .subscribe((photoURL) => {
          updateProfile(user, { displayName: username, photoURL }).then(() => {
            console.log('User profile updated successfully with picture');
          });
        });
    } else {
      updateProfile(user, { displayName: username }).then(() => {
        console.log('User profile updated successfully without picture');
      });
    }
  }
}
