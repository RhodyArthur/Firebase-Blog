import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData, deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  updateDoc
} from "@angular/fire/firestore";
import {catchError, from, Observable, retry, take, throwError} from "rxjs";
import {Comment} from "../model/comment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private firestore: Firestore) { }

  // Get comments for a specific post
  getComments(postId: string): Observable<Comment[]> {
    const commentCollection = collection(this.firestore, `post/${postId}/comments`);
    const commentsQuery = query(commentCollection, orderBy('createdAt', 'desc'));

    return collectionData(commentsQuery, { idField: 'id' }) as Observable<Comment[]>;
  }

  // Read a single comment
  getComment(id: string): Observable<Comment | undefined> {
    const postRef = doc(this.firestore, 'comments', id)
    return docData(postRef, {idField: 'id'}) as Observable<Comment | undefined>;
  }

  // create a post
  createComment(postId: string, comment: Comment) {
    const commentCollection = collection(this.firestore, `post/${postId}/comments`);

    comment.createdAt = new Date();
    comment.updatedAt = new Date();
    const response = from(addDoc(commentCollection, comment));
    return response.pipe(
      take(1),
      retry(3),
      catchError(err => {
        return throwError(() => err.message || 'Failed to create comment')
      })
    )
  }

  // update or edit a comment
  updateComment(commentId: string, updatedComment: Partial<Comment>) {
    updatedComment.updatedAt = new Date();
    const postRef = doc(this.firestore, 'comments', commentId);
    return from(updateDoc(postRef, updatedComment)).pipe(
      retry(3),
      catchError(err => {
        return throwError(() => err.message || 'Failed to update comment')
      })
    )
  }

  //   delete post
  deletePost(commentId: string): Observable<void>{
    const postRef = doc(this.firestore, 'comments', commentId)
    return  from(deleteDoc(postRef)).pipe(
      retry(3),
      catchError(err => {
        return throwError(() => err.message || 'Failed to delete comment')
      })
    )
  }
}
