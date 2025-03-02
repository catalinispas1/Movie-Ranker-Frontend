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
    return this.http.get<User>(this.userDetailsUrl)
  }

  getMovieList(page: number, queryParams: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.movieListUrl}?page=${page}`)
  }

  getSearchedMovies(page: number, searchedMovieParam: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.searchMovieUrl}?page=${page}&query=${searchedMovieParam}`)
  }

  getFilteredMovies(page:number, filterMovieParam: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.filterMovieUrl}?page=${page}&${filterMovieParam}`)
  }

  getFavoriteMovies(page: number): Observable<FavoriteMoviesResponse> {
    return this.http.get<FavoriteMoviesResponse>(`${environment.apiUrl}/user/fav/movies?page=${page}`)
  }
}
