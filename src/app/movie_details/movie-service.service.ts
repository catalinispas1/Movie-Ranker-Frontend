import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre, MovieDetails } from '../models/movie-details';
import { environment } from 'src/environments/environment.development';
import { MovieCommentsPage } from '../models/commentsResponse';

@Injectable({
  providedIn: 'root'
})
export class MovieServiceService {
  private currentMovieUrl = environment.apiUrl + "/movie/details"
  constructor(private http: HttpClient) { }

  getCurrentMovie(id: string | null): Observable<MovieDetails> {
      return this.http.get<MovieDetails>(`${this.currentMovieUrl}?id=${id}`)
  }

  isFavorite(id: string | null): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/is/movie/fav?id=${id}`)
  }

  addToFavorites(id: string | null, posterPath: string | undefined, title: string | undefined, genres: Genre[] | undefined): Observable<any> {
    return this.http.post(`${environment.apiUrl}/add/fav/movie?id=${id}&posterPath=${posterPath}&title=${title}`, genres)
  }

  removeFromFavorites(id: string | null, genres: Genre[] | undefined): Observable<any> {
    return this.http.post(`${environment.apiUrl}/remove/fav/movie?id=${id}`, genres)
  }

  rateMovie(id: string | null, rating: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rate/movie?id=${id}&rating=${rating}`, null)
  }

  getMovieRating(id: string | null): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/get/movie/rating?id=${id}`)
  }

  postMovieComment(id: string | null, comment: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/post/movie/comment?id=${id}&comment=${comment}`, null)
  }

  getMovieComments(id: string | null, page: number): Observable<MovieCommentsPage> {
    return this.http.get<MovieCommentsPage>(`${environment.apiUrl}/get/movie/comments?id=${id}&page=${page}`)
  }

  getAverageRating(id: string | null): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/get/avg/rating?id=${id}`)
  }
}
