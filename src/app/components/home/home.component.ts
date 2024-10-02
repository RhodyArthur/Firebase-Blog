import {Component, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {PostListComponent} from "../post-list/post-list.component";
import {CreateEditPostComponent} from "../modal/create-edit-post/create-edit-post.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, PostListComponent, CreateEditPostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showForm: boolean = false;

  displayForm() {
    this.showForm = !this.showForm;
  }
}
