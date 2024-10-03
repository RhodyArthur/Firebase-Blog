import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CommentService} from "../../../services/comment.service";
import {User} from "@angular/fire/auth";
import {AuthService} from "../../../services/auth.service";

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
  comment!: Comment | null
  postId!: string | null;
  user : User | null = this.authService.getCurrentUser();

  constructor(private fb: FormBuilder, private router: Router, private  route: ActivatedRoute,
              private commentService: CommentService, private authService: AuthService) {
  }
  ngOnInit() {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
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
