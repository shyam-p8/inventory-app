import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  // Method to check if the token is expired
  isTokenExpired(): boolean {
    const sessionEnd = sessionStorage.getItem('session_end');
    const currentTime = new Date().getTime();
    return sessionEnd ? currentTime > +sessionEnd : true;
  }

  // Method to log out the user
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('session_end');
    this.router.navigate(['/login']); // Redirect to the login page
  }

  // Method to be called periodically or on page load
  checkSession(): void {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }
}
