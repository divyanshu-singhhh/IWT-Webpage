import { Injectable } from '@angular/core';
import { Observable, throwError , Subject, BehaviorSubject} from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser ;
  public loginFailed: Subject<any> =  new Subject();

  constructor(private http: HttpClient, public router: Router) {
  }

  // Sign-up
  signUp(user: any): Observable<any> {
    let api = `/api/users`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  // Sign-in
  signIn(user: any) {
    return this.http
      .post<any>(`/api/users/login`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        this.currentUser = res.user;
        this.router.navigate(['main']);
      }, (err) => {
        console.log(err);
        this.loginFailed.next(err);
      });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  async isLoggedIn() {
    let authToken = localStorage.getItem('access_token');
    if(authToken){
      try{
        await this.http.get(`/api/users/me`).toPromise();
        return true;
      }catch(e){
        return false;
      }
    }else{
      return false;
    }
  }

  async getUser() {
    if (localStorage.getItem('access_token')) {

      if (this.currentUser) {
        return this.currentUser;

      } else {

        this.currentUser = await this.http.get(`/api/users/me`).toPromise();
        return this.currentUser;

      }

    } else {
      return null;
    }
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  // Error
  handleError(error: HttpErrorResponse) {
    console.log(error);
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
