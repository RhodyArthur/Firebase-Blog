import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Post} from "../../model/post";
import {PostService} from "../../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {CreateEditPostComponent} from "../modal/create-edit-post/create-edit-post.component";

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    CreateEditPostComponent
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent implements OnInit{
  post$!: Observable<Post | undefined>;
  postId!: string | null;
  isLoading: boolean = false;
  showForm: boolean = false;

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.post$ = this.postService.getPost(this.postId)
    }
  }


  displayForm() {
    this.showForm = !this.showForm
  }
}
