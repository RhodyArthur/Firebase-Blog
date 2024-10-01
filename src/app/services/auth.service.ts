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
      )
      .then((response) => updateProfile(response.user, {displayName: username}))
      .then(() => {
        this.setUserData(this.firebaseAuth.currentUser)
      })

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
      this.setUserData(result.user)
      return result.user;
    })

    return from(promise);
  }

  // log out
  logout() {
    this.clearUser();
    return from(signOut(this.firebaseAuth));
  }

  // get current user
  // getCurrentUser(): User | null {
  //   return this.firebaseAuth.currentUser;
  // }
  getCurrentUser(): User | null {
    const user = this.firebaseAuth.currentUser;

    if(user) {
      this.setUserData(user)
    }

    return user;
  }

  // set data to local storage
  setUserData(user: User | null) {
      const userData = { email : user?.email, username: user?.displayName};   
      localStorage.setItem('userData', JSON.stringify(userData))
  }

  // get user from local storage
  getUserData() {
    const storedUser = localStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // clear user from local storage
  private clearUser() {
    localStorage.removeItem('userData');
  }
}
