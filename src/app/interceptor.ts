import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, switchMap, filter, take } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.development";
import {jwtDecode} from 'jwt-decode'; 

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private http: HttpClient, private router: Router) {}

  private refreshTokenUrl = `${environment.apiUrl}/refresh-token`;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = localStorage.getItem('movie_ranker_auth');

    if (!req.url.includes('/authenticate') && !req.url.includes('/register/user') && !req.url.includes('/refresh-token')) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
    } else {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) { 
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshToken().pipe(
        switchMap((newAccessToken: string) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newAccessToken);
          return next.handle(this.addToken(req, newAccessToken));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
    } else {
      // Daca deja se face refresh, asteptam noul token si refacem cererea dupa ce este gata
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((newAccessToken) => {
          return next.handle(this.addToken(req, newAccessToken!));
        })
      );
    }
  }

  private refreshToken(): Observable<string> {
    let refreshToken = localStorage.getItem('movie_ranker_refresh');
  
    if (!refreshToken || this.isTokenExpired(refreshToken)) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }
  
    return this.http.post<{ accessToken: string }>(
      this.refreshTokenUrl,
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    ).pipe(
      switchMap(response => {
        const newAccessToken = response.accessToken;
        localStorage.setItem('movie_ranker_auth', newAccessToken);
        return new Observable<string>(observer => { 
          observer.next(newAccessToken);
          observer.complete();
        });
      })
    );
  }
  

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private logout() {
    localStorage.removeItem('movie_ranker_auth');
    localStorage.removeItem('movie_ranker_refresh');
    this.router.navigate(['/login']);
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken = jwtDecode(token) as { exp: number };
    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate < new Date();
  }
}
