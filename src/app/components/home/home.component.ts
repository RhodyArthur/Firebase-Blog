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

  displayForm() {
    this.showForm = !this.showForm;
  }

  closeForm() {
    this.showForm = false;
  }
}
