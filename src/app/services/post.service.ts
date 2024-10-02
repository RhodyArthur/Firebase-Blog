import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private fireStore: Firestore) { }
  postCollection = collection(this.fireStore, 'post');

  // get all posts
  getPosts(): Observable<Post[]> {
    // const postsQuery = query(this.postCollection, orderBy('createdAt', 'desc'));
    return collectionData(this.postCollection, {idField: 'id'}) as Observable<Post[]>
  }
}
