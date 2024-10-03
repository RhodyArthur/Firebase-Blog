import {Component, OnInit} from '@angular/core';
import {PostService} from "../../../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Post} from "../../../model/post";
import {Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {User} from "@angular/fire/auth";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent implements OnInit{
  post$!: Observable<Post | undefined>;
  postId!: string | null;
  user : User | null = this.authService.getCurrentUser();
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.post$ = this.postService.getPost(this.postId)
    }
  }

//   delete post
  deletePost(postId: string) {
    this.isLoading = true;

    // check if user is logged in
    if (!this.user) {
      this.errorMessage = 'You must be logged in to delete a post.';
      this.clearErrorMessage();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000)
      return;
    }

    // is user authorized to delete
    if (this.postId !== this.user.uid) {
      this.errorMessage = 'You are not authorized to delete this post.';
      this.clearErrorMessage();
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000)
      return;
    }
      this.postService.deletePost(postId).subscribe({
        next: () => {
          console.log('Post deleted successfully');
          this.postService.getPosts();
          this.router.navigate(['/']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          this.errorMessage = err.code;
          this.isLoading = false
        }
      });
  }

  clearErrorMessage() {
    setTimeout(()=> {
      this.errorMessage = null;
    }, 2000)
  }
}
