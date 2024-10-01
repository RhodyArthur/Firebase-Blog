import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserInterface } from '../../model/user-interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  user: UserInterface | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const firebaseUser = this.authService.getCurrentUser();
    if (firebaseUser) {
      this.user = {
        email: firebaseUser.email,
        username: firebaseUser.displayName,
      };
    } else {
      const storedUser = this.authService.getUserData();
      if (storedUser) {
        this.user = {
          email: storedUser.email,
          username: storedUser.username,
        };
      } else {
        this.router.navigate(['login']);
      }
    }
  }
  // logout user 
  logOut() {
    this.authService.logout();
    this.router.navigate(['login'])
  }
}
