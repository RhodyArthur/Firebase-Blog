import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RegisterComponent} from "./components/register/register.component";
import { PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'blog-firebase';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts().subscribe(data => console.log(data))
  }
}
