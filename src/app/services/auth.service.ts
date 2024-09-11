import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sessionTime = new BehaviorSubject<number>(0);
  sessionTime$ = this.sessionTime.asObservable();

  constructor(private router: Router) {
    this.startSessionTimer();
  }

  // This method checks if the user is authenticated by verifying a token in sessionStorage or localStorage
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');  // Use your token handling logic
    return !!token;  // Return true if token exists
  }
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

  

  // Method to calculate remaining session time
  private calculateRemainingTime(): number {
    const sessionEnd = sessionStorage.getItem('session_end');
    const currentTime = new Date().getTime();
    return sessionEnd ? +sessionEnd - currentTime : 0;
  }

  // Start a timer to update session time periodically
  private startSessionTimer(): void {
    interval(1000).subscribe(() => {
      const remainingTime = this.calculateRemainingTime();
      if (remainingTime > 0) {
        this.sessionTime.next(remainingTime);
      } else {
        this.sessionTime.next(0);
      }
    });
  }
   getAccessToken(){
    return sessionStorage.getItem('token');
  }


}
