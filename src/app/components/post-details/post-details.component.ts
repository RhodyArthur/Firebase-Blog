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

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    CreateEditPostComponent,
    DeleteComponent
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
  comments$!: Observable<Comment[]>;
  errorMessage: string | null = null;

  constructor(private postService: PostService, private route: ActivatedRoute, private commentService: CommentService) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.post$ = this.postService.getPost(this.postId)
      this.comments$ = this.commentService.getComments(this.postId)
    }

  }


  displayForm() {
    this.showForm = !this.showForm
  }

  displayModal() {
    this.showDelete = !this.showDelete
  }
}
