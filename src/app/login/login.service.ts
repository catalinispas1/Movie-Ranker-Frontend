import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = environment.apiUrl + "/authenticate"
  private newUserUrl = environment.apiUrl + "/register/user"

  constructor(private http: HttpClient) { }

  loginUser(username: string, password: string): Observable<{accessToken: string, refreshToken: string}> {
    const body = { username, password }
    return this.http.post<{accessToken: string, refreshToken: string}>(this.loginUrl, body)
  }
  
  authUser(username: string, password: string): Observable<{accessToken: string, refreshToken: string}>{
    const body = { username, password }
    return this.http.post<{accessToken: string, refreshToken: string}>(this.newUserUrl, body)
  }
}
