import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  user: User | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
   this.user = this.authService.getCurrentUser();
   if(!this.user) {
    const storedUser = this.authService.getUserData();

    if(storedUser) {
      this.user = {
        email: storedUser.email,
        displayName: storedUser.displayName,
      } as User;
    }
    else {
      this.router.navigate(['login'])
    }
   }
  }

  // logout user 
  logOut() {
    this.authService.logout();
    this.router.navigate(['login'])
  }
}
