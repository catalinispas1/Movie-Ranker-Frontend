import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieDetails } from '../models/movie-details';
import { environment } from 'src/environments/environment.development';
import { MovieCommentsPage } from '../models/commentsResponse';

@Injectable({
  providedIn: 'root'
})
export class MovieServiceService {
  private currentMovieUrl = environment.apiUrl + "/movie/details"
  constructor(private http: HttpClient) { }

  getCurrentMovie(id: string | null): Observable<MovieDetails> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.get<MovieDetails>(`${this.currentMovieUrl}?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

  isFavorite(id: string | null): Observable<boolean> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.get<boolean>(`${environment.apiUrl}/is/movie/fav?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

  addToFavorites(id: string | null, posterPath: string | undefined, title: string | undefined): Observable<any> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.post(`${environment.apiUrl}/add/fav/movie?id=${id}&posterPath=${posterPath}&title=${title}`, null, {
        headers: { Authorization: `Bearer ${token}` }
    })
  }

  removeFromFavorites(id: string | null): Observable<any> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.post(`${environment.apiUrl}/remove/fav/movie?id=${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
    })
  }

  rateMovie(id: string | null, rating: number): Observable<any> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.post(`${environment.apiUrl}/rate/movie?id=${id}&rating=${rating}`, null, {
        headers: { Authorization: `Bearer ${token}` }
    })
  }

  getMovieRating(id: string | null): Observable<number> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.get<number>(`${environment.apiUrl}/get/movie/rating?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
  }

  postMovieComment(id: string | null, comment: string): Observable<any> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.post(`${environment.apiUrl}/post/movie/comment?id=${id}&comment=${comment}`, null, {
        headers: { Authorization: `Bearer ${token}` }
    })
  }

  getMovieComments(id: string | null, page: number): Observable<MovieCommentsPage> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.get<MovieCommentsPage>(`${environment.apiUrl}/get/movie/comments?id=${id}&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
  }

  getAverageRating(id: string | null): Observable<number> {
    const token = localStorage.getItem("movie_ranker_auth")
    return this.http.get<number>(`${environment.apiUrl}/get/avg/rating?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
  }
}
