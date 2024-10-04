import {Component, Input, OnInit} from '@angular/core';
import {catchError, Observable, of} from "rxjs";
import {Post} from "../../model/post";
import {PostService} from "../../services/post.service";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {UserInterface} from "../../model/user-interface";
import {CreateEditCommentComponent} from "../modal/create-edit-comment/create-edit-comment.component";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    CreateEditCommentComponent
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit{
  posts$!: Observable<Post[]>;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  @Input() user: UserInterface | null = null;
  showCommentForm: boolean = false;
  currentPostId: string | null = null;


  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    // this.isLoading = true;
    this.posts$ = this.postService.getPosts().pipe(
      catchError(err => {
        console.error(err);
        this.errorMessage = err.code;
        this.isLoading = false;
        return of([] || 'Failed to load posts');
      })
    );
    console.log(this.user)
  }

  // view post details
  viewPost(postId: string) {
    this.router.navigate(['/details', postId])
  }

  // display add comment form
  displayCommentForm(postId: string) {
    this.currentPostId = postId;
    this.showCommentForm = true;
    console.log(postId)
  }

  hideCommentForm() {
    this.currentPostId = null;
    this.showCommentForm = false;
  }
}
