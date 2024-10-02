import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RegisterComponent} from "./components/register/register.component";
import {Post} from "./model/post";
import {PostService} from "./services/post.service";

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

  async submitPost() {
    const newPost: Post = {
      title: 'My New Post',
      content: 'This is the content of the post.',
      userId: '1',
      commentsCount: 2// Replace with actual author ID
    };

    console.log('helo')
    this.postService.createPost(newPost).subscribe({
      next: (message) => {
        console.log(message); // Success message
      },
      error: (error) => {
        console.error('Error:', error); // Handle error appropriately
      }
    });
  }
}
