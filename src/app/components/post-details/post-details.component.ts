import {Component, OnInit} from '@angular/core';
import {catchError, Observable, of} from "rxjs";
import {Post} from "../../model/post";
import {PostService} from "../../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {CreateEditPostComponent} from "../modal/create-edit-post/create-edit-post.component";
import {DeleteComponent} from "../modal/delete/delete.component";
import {CommentService} from "../../services/comment.service";
import {Comment} from "../../model/comment";
import {CreateEditCommentComponent} from "../modal/create-edit-comment/create-edit-comment.component";

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    CreateEditPostComponent,
    DeleteComponent,
    CreateEditCommentComponent
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent implements OnInit{
  post$!: Observable<Post | undefined>;
  postId!: string | null;
  isLoading: boolean = false;
  showForm: boolean = false;
  showDelete: boolean = false;
  showCommentForm: boolean = false;
  showCommentDelete: boolean = false;
  comments$!: Observable<Comment[]>;
  comment$!: Observable<Comment | undefined>;
  errorMessage: string | null = null;
  commentId!: string | null;

  constructor(private postService: PostService, private route: ActivatedRoute, private commentService: CommentService) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.post$ = this.postService.getPost(this.postId);
      this.comments$ = this.commentService.getComments(this.postId);

    }

  }


  displayForm() {
    this.showForm = !this.showForm
  }

  displayModal() {
    this.showDelete = !this.showDelete
  }

  // show form for comment
  displayCommentForm(commentId: string) {
    this.commentId = commentId;
    this.comment$ = this.commentService.getComment(commentId);
    this.comment$.subscribe(data => console.log(data))
    this.showCommentForm = true;
  }

  // show delete for comment
  displayCommentDelete() {
    this.showCommentDelete = !this.showCommentDelete;
  }
}
