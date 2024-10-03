import {Component, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {PostListComponent} from "../post-list/post-list.component";
import {CreateEditPostComponent} from "../modal/create-edit-post/create-edit-post.component";
import {AuthService} from "../../services/auth.service";
import {UserInterface} from "../../model/user-interface";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, PostListComponent, CreateEditPostComponent, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showForm: boolean = false;
  user: UserInterface | null = null;

  constructor(private authService: AuthService) {}

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
  displayForm() {
    this.showForm = !this.showForm;
  }
}
