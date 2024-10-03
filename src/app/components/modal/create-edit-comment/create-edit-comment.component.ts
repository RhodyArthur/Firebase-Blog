import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CommentService} from "../../../services/comment.service";
import {User} from "@angular/fire/auth";
import {AuthService} from "../../../services/auth.service";
import {Comment} from "../../../model/comment";

@Component({
  selector: 'app-create-edit-comment',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './create-edit-comment.component.html',
  styleUrl: './create-edit-comment.component.scss'
})
export class CreateEditCommentComponent implements OnInit{
  errorMessage: string | null = null;
  isLoading: boolean = false;
  commentForm!: FormGroup;
  @Input() comment!: Comment | null
  postId!: string | null;
  user : User | null = this.authService.getCurrentUser();

  constructor(private fb: FormBuilder, private router: Router, private  route: ActivatedRoute,
              private commentService: CommentService, private authService: AuthService) {
  }
  ngOnInit() {
    this.commentForm = this.fb.group({
      content: [this.comment?.content || '', Validators.required]
    })

    this.postId = this.route.snapshot.paramMap.get('id');
  }

  // send comment
  onSend() {
    if (this.commentForm.valid) {
      const  newComment =
      {
        author: this.user?.displayName,
        ...this.commentForm.value
      };

        this.isLoading = true;
      if (this.postId) {
        if (!this.user) {
          this.errorMessage = 'You must be logged in to post a comment.';
          this.clearErrorMessage();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000)
          return;
        }

        this.commentService.createComment(this.postId, newComment).subscribe({
          next: () => {
            this.comment = newComment;
            this.commentForm.reset();
            this.router.navigate(['/']);
            this.errorMessage = null;
            this.isLoading = false;
          },
          error: err => {
            console.error(err.code);
            this.isLoading = false;
            this.errorMessage = err.code || 'Failed to create comment';
          }
        })
      }
    }
  }

  onEdit() {
    const editComment = this.commentForm.value;
    if (this.comment && this.comment.id) {
      // check if user is logged in
      if (!this.user) {
        this.errorMessage = 'You must be logged in to edit a comment.';
        this.clearErrorMessage();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000)
        return;
      }

      // is user authorized to edit
      if (this.comment.author !== this.user.displayName) {
        this.errorMessage = 'You are not authorized to edit this post.';
        this.clearErrorMessage();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000)
        return;
      }

    //   edit comment
      this.commentService.updateComment(this.comment.id, editComment).subscribe({
        next: () => {
          this.comment = editComment;
          this.commentForm.reset();
          this.router.navigate(['/details', this.postId]);
          this.errorMessage = null;
          this.isLoading = false;
        },
        error: err => {
          console.error(err.code);
          this.isLoading = false;
          this.errorMessage = err.code || 'Failed to update post';
          this.clearErrorMessage();
        }
      })

    }
  }

  // Discard changes
  discard() {
    this.commentForm.reset();
    this.router.navigate(['']);
  }

  clearErrorMessage() {
    setTimeout(()=> {
      this.errorMessage = null;
    }, 2000)
  }
}
