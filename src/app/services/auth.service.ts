import { Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User, UserCredential} from '@angular/fire/auth';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseAuth: Auth) { }

  // create a user
  register(email: string, username: string, password: string): Observable<void> {
      const promise = createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      ).then((response) =>
      updateProfile(response.user, {displayName: username}))

     return from(promise)
  }

  // log in user
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {})

    return from(promise)
  }

  // sign in with google
  googleSignIn(): Observable<User> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firebaseAuth, provider)
    .then((result: UserCredential) => {
      return result.user;
    })

    return from(promise);
  }

  // log out
  logout() {
    return from(signOut(this.firebaseAuth));
  }

  // get current user
  getCurrentUser(): User | null {
    return this.firebaseAuth.currentUser;
  }
}
