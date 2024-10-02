import { Injectable } from '@angular/core';
import {collection, collectionData, Firestore, orderBy, query, doc, docData, addDoc} from '@angular/fire/firestore';
import {catchError, from, map, Observable, retry, take, throwError} from 'rxjs';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firestore: Firestore) {

  }
  postCollection = collection(this.firestore, 'post');

  // get all posts
  getPosts(): Observable<Post[]> {
    const postsQuery = query(this.postCollection, orderBy('createdAt', 'desc'));
    return collectionData(postsQuery, {idField: 'id'})
      .pipe(
      // catchError(err => {
      //   console.error(err)
      //   return of([] as Post[])
      // })
    ) as Observable<Post[]>
  }

  // Read a single post
  getPost(id: string): Observable<Post | undefined> {
    const postRef = doc(this.firestore, 'post', id)
    return docData(postRef, {idField: 'userId'}) as Observable<Post | undefined>;
  }

  // create a post
  createPost(post: Post) {
    post.createdAt = new Date();
    post.updatedAt = new Date();
    const response = from(addDoc(this.postCollection, post));
    return response.pipe(
      take(1),
      map(data => {
        console.log(data);
        return 'blog posted successfully'
      }),
      retry(3),
      catchError(err => {
        return throwError(() => err.message || 'Failed to create post')
      })
    )
  }
}
