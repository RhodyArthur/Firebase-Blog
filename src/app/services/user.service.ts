import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: { username: string; email: string } | null = null;

  constructor() { }

  // set item to local storage
  setUserData(username: string, email: string) {
    const userData = { username, email };
    this.userData = userData;
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  // get item from local storage
  getUserData() {
    if(!this.userData) {
      const storedData = localStorage.getItem('userData');

      if(storedData) {
        this.userData = JSON.parse(storedData)
      }
    }
    return this.userData;
  }

  // clear item from local storage
  clearUserData() {
    this.userData = null;
    localStorage.removeItem('userData')
  }
}
