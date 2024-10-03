import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  doc,
  docData,
  addDoc,
  updateDoc, deleteDoc
} from '@angular/fire/firestore';
import {catchError, from, Observable, retry, take, throwError} from 'rxjs';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firestore: Firestore) {

  }
  // postCollection = collection(this.firestore, 'post');

  // get all posts
  getPosts(): Observable<Post[]> {
    const   postCollection = collection(this.firestore, 'post');
    const postsQuery = query(postCollection, orderBy('createdAt', 'desc'));
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
    return docData(postRef, {idField: 'id'}) as Observable<Post | undefined>;
  }

  // create a post
  createPost(post: Post) {
    const postCollection = collection(this.firestore, 'post');

    post.createdAt = new Date();
    post.updatedAt = new Date();
    const response = from(addDoc(postCollection, post));
    return response.pipe(
      take(1),
      retry(3),
      catchError(err => {
        return throwError(() => err.message || 'Failed to create post')
      })
    )
  }

  // update or edit a post
  updatePost(postId: string, updatedPost: Partial<Post>) {
    updatedPost.updatedAt = new Date();
    const postRef = doc(this.firestore, 'post', postId);
    return from(updateDoc(postRef, updatedPost)).pipe(
      retry(3),
      catchError(err => {
        return throwError(() => err.message || 'Failed to update post')
      })
    )
  }

//   delete post
  deletePost(postId: string): Observable<void>{
    const postRef = doc(this.firestore, 'post', postId)
    return  from(deleteDoc(postRef)).pipe(
      retry(3),
      catchError(err => {
        return throwError(() => err.message || 'Failed to delete post')
      })
    )
  }
}
