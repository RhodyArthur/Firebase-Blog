import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {RegisterComponent} from "./components/register/register.component";
import {UserInterface} from "./model/user-interface";
import {AuthService} from "./services/auth.service";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'blog-firebase';

  user: UserInterface | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const firebaseUser = this.authService.getCurrentUser();
    if (firebaseUser) {
      this.user = {
        email: firebaseUser.email,
        username: firebaseUser.displayName,
        profileImg: firebaseUser.photoURL
      };
    } else {
      const storedUser = this.authService.getUserData();
      if (storedUser) {
        this.user = {
          email: storedUser.email,
          username: storedUser.username,
          profileImg: storedUser.profileImage
        };
      }
    }
  }

//   display profile
  displayProfile() {
    this.router.navigate(['/profile'])
  }

}
