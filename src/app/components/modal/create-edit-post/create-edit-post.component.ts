import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostService} from "../../../services/post.service";
import {Post} from "../../../model/post";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-edit-post',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-edit-post.component.html',
  styleUrl: './create-edit-post.component.scss'
})
export class CreateEditPostComponent implements OnInit{
  postForm!: FormGroup;
  post!: Post;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private postService: PostService, private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      commentsCount: [0]
    })
  }

  onSend() {
    if (this.postForm.valid) {
      // get user id from auth service, if no id represent with empty
      // make sure user is logged in before he can make a post
      const user = this.authService.getCurrentUser();
      const userId = user ? user.uid : '';

      const newPost: Post = {
        userId: userId,
        ...this.postForm.value
      }

      this.postService.createPost(newPost).subscribe({
        next: () => {
          this.post = newPost;
          this.postForm.reset();
          this.router.navigate(['/']);
          this.errorMessage = null;
          this.isLoading = false;
          console.log(newPost)
        },
        error: err => {
          console.error(err.code);
          this.isLoading = false;
          this.errorMessage = err.code || 'Failed to create post';
        }
        }
      )

    }
  }

  // Discard changes
  discard() {
    this.postForm.reset();
    this.router.navigate(['']);
  }
}
