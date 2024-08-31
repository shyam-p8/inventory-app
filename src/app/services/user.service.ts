import { Injectable } from '@angular/core';
import { login, signUp } from '../data-type';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private route: Router) { }


  userLogin(data: login) {

    this.http.post(`https://rebilling.mpwin.co.in:4200/rebilling/login`,data).subscribe((res)=>{console.warn("api response ="+res)});
  // this.http.get<signUp[]>(`http://localhost:3000/users?email=${data.username}&password=${data.password}`, { observe: 'response' })
  //     .subscribe((result) => {
  //       if (result && result.body?.length) {
  //         localStorage.setItem('user', JSON.stringify(result.body));
  //         //this.invalidUserAuth.emit(false);
  //        this.route.navigate(['/home']);
  //       } else {
  //        // this.invalidUserAuth.emit(true);
  //        alert("invalid user data");
  //       }
  //     });

  }
}
