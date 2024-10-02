import {Component, OnInit} from '@angular/core';
import {PostService} from "../../../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Post} from "../../../model/post";
import {Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";

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
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.post$ = this.postService.getPost(this.postId)
    }
  }

//   delete post
  deletePost(postId: string) {
    this.isLoading = true;
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
}
