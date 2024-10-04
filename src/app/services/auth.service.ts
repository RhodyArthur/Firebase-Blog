import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User, UserCredential} from '@angular/fire/auth';
import { getDownloadURL, ref, uploadBytes, Storage } from '@angular/fire/storage';
import {from, map, Observable, switchMap} from 'rxjs';
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseAuth: Auth, private storage: Storage, @Inject(PLATFORM_ID) private platformId: Object) { }

  // create a user
  register(email: string, username: string, password: string): Observable<User> {
      const promise = createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      )
      .then(async (response) => {
        await updateProfile(response.user, {displayName: username});
        return response.user;})
      .then((user) => {
        this.setUserData(user)
        return user;
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

  // sign in with Google
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

  getCurrentUser(): User | null {
    const user = this.firebaseAuth.currentUser;

    if(user) {
      this.setUserData(user)
    }

    return user;
  }

  // set data to local storage
  setUserData(user: User | null) {
      const userData = { email : user?.email, username: user?.displayName, profileImage: user?.photoURL};
      localStorage.setItem('userData', JSON.stringify(userData))
  }

  // get user from local storage
  getUserData() {
    if (isPlatformBrowser(this.platformId)) {
    const storedUser = localStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) : null;
  }
  }

  // clear user from local storage
  private clearUser() {
    localStorage.removeItem('userData');
  }

  // upload user profile
  uploadProfilePicture(file: File, user: User): Observable<string> {
    const filePath = `profilePictures/${user.uid}/${file.name}`;
    const storageRef = ref(this.storage, filePath);

    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(() => {
        return (getDownloadURL(storageRef))
      }),
      map((url) => {
        this.setUserData({...user, photoURL: url})
        return url
      })
    );
  }
}
