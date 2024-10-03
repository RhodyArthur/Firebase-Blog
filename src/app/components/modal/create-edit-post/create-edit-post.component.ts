import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostService} from "../../../services/post.service";
import {Post} from "../../../model/post";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "@angular/fire/auth";

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
  @Input() post!: Post | null;
  postId!: string | null;
  user : User | null = this.authService.getCurrentUser();
  errorMessage: string | null = null;
  isLoading: boolean = false;


  constructor(private fb: FormBuilder, private postService: PostService, private authService: AuthService,
              private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: [this.post?.title || '', Validators.required],
      content: [this.post?.content || '', Validators.required],
      commentsCount: [this.post?.commentsCount || 0]
    })

    this.postId = this.route.snapshot.paramMap.get('id');
    console.log(this.postId)
  }

  onSend() {
    if (this.postForm.valid) {
      // get user id from auth service, if no id represent with empty
      // make sure user is logged in before he can make a post
      const userId = this.user ? this.user.uid : '';

      const newPost: Post = {
        userId: userId,
        authorName: this.user?.displayName,
        ...this.postForm.value
      }

      // create post
      if (userId) {
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
      else {
      //   redirect to log in
        this.router.navigate(['login'])
      }
    }
  }

  onUpdate() {
    const editPost = this.postForm.value;
    if (this.post && this.postId) {
      // check if user is logged in
      if (!this.user) {
        this.errorMessage = 'You must be logged in to edit a post.';
        this.clearErrorMessage();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000)
        return;
      }

      // is user authorized to edit
      if (this.post.userId !== this.user.uid) {
        this.errorMessage = 'You are not authorized to edit this post.';
        this.clearErrorMessage();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000)
        return;
      }

      // edit post
      this.postService.updatePost(this.postId, editPost).subscribe({
          next: () => {
            this.post = editPost;
            this.postForm.reset();
            this.router.navigate(['/details', this.postId]);
            this.errorMessage = null;
            this.isLoading = false;
            console.log(editPost, 'updated')
          },
          error: err => {
            console.error(err.code);
            this.isLoading = false;
            this.errorMessage = err.code || 'Failed to update post';
            this.clearErrorMessage();
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

  clearErrorMessage() {
    setTimeout(()=> {
      this.errorMessage = null;
    }, 2000)
  }
}
