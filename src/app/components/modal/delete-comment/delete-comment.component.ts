import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {Post} from "../../../model/post";
import {User} from "@angular/fire/auth";
import {PostService} from "../../../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {CommentService} from "../../../services/comment.service";
import {Comment} from "../../../model/comment";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-delete-comment',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './delete-comment.component.html',
  styleUrl: './delete-comment.component.scss'
})
export class DeleteCommentComponent implements OnInit{

  post$!: Observable<Post | undefined>;
  comment$!: Observable<Comment | undefined>;
  postId!: string | null;
  @Input() commentId!: string | null;
  comment!: Comment | undefined;
  user : User | null = this.authService.getCurrentUser();
  errorMessage: string | null = null;
  isLoading: boolean = false;
  @Output() hideEvent = new EventEmitter<void>();

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private commentService: CommentService) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.post$ = this.postService.getPost(this.postId);
      this.comment$ = this.commentService.getComment(this.postId, this.commentId);
      this.comment$.subscribe(data => {
        this.comment = data
      })
    }
  }

//   delete comment
  deleteComment() {
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
    if (this.comment?.author !== this.user.displayName) {
      this.errorMessage = 'You are not authorized to delete this post.';
      this.clearErrorMessage();
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000)
      return;
    }

    this.commentService.deleteComment(this.postId, this.commentId).subscribe({
      next: () => {
        console.log('Comment deleted successfully');
        this.postService.getPosts();
        this.router.navigate(['/details', this.postId]);
        this.isLoading = false;
        this.hideModal();
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
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

  hideModal() {
    this.hideEvent.emit();
  }
}
