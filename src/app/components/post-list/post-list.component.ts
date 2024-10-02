import {Component, OnInit} from '@angular/core';
import {catchError, Observable, of, throwError} from "rxjs";
import {Post} from "../../model/post";
import {PostService} from "../../services/post.service";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit{
  posts$!: Observable<Post[]>;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.posts$ = this.postService.getPosts().pipe(
      catchError(err => {
        console.error(err);
        this.errorMessage = err.code;
        return of([] || 'Failed to load posts')
      })
    );
  }
}
