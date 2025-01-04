import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment.development';
import { MovieResponse } from '../models/movie-response';
import { FavoriteMoviesResponse } from '../models/favorite-movies.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private userDetailsUrl = environment.apiUrl + "/user/details"
  private movieListUrl = environment.apiUrl + "/popular"
  private searchMovieUrl = environment.apiUrl + "/search/movie"
  private filterMovieUrl = environment.apiUrl + "/filter/movie"

  movieResponseSubject = new BehaviorSubject<MovieResponse | null>(null);

  movieResponse$: Observable<MovieResponse | null> = this.movieResponseSubject.asObservable();

  setMovieList(movieResponse: MovieResponse): void {
    this.movieResponseSubject.next(movieResponse); 
  }

  getMovieResponse(): MovieResponse | null {
    return this.movieResponseSubject.value;
  }

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<User> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.get<User>(this.userDetailsUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getMovieList(page: number, queryParams: string): Observable<MovieResponse> {
    const token = localStorage.getItem("movie_ranker_auth")
    console.log(`Request URL: ${this.movieListUrl}?page=${page + queryParams}`);
    return this.http.get<MovieResponse>(`${this.movieListUrl}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getSearchedMovies(page: number, searchedMovieParam: string): Observable<MovieResponse> {
    const token = localStorage.getItem("movie_ranker_auth")
    console.log(`Request URL: ${this.searchMovieUrl}?page=${page}&query=${searchedMovieParam}`);
    return this.http.get<MovieResponse>(`${this.searchMovieUrl}?page=${page}&query=${searchedMovieParam}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getFilteredMovies(page:number, filterMovieParam: string): Observable<MovieResponse> {
    const token = localStorage.getItem("movie_ranker_auth")
    console.log(`Request URL: ${this.filterMovieUrl}?page=${page}&query=${filterMovieParam}`);
    return this.http.get<MovieResponse>(`${this.filterMovieUrl}?page=${page}&${filterMovieParam}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getFavoriteMovies(page: number): Observable<FavoriteMoviesResponse> {
    const token = localStorage.getItem("movie_ranker_auth");
    console.log(`Request URL: ${environment.apiUrl}/user/fav/movies?page=${page}`);
    
    return this.http.get<FavoriteMoviesResponse>(`${environment.apiUrl}/user/fav/movies?page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
  }
}
