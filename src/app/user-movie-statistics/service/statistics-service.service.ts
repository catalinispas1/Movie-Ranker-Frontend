import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { FavoriteGenresCount } from 'src/app/models/favoriteGenresCount';

@Injectable({
  providedIn: 'root'
})
export class StatisticsServiceService {
  private currentMovieUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getFavoriteMoviesCount(): Observable<number> {
    return this.http.get<number>(`${this.currentMovieUrl}/get/fav/count`)
  }

  getAverageRating(): Observable<number> {
    return this.http.get<number>(`${this.currentMovieUrl}/get/average/user-movie-rates`)
  }

  getTotalCommentsPosted(): Observable<number> {
    return this.http.get<number>(`${this.currentMovieUrl}/get/user-comments-count`)
  }

  getFavoriteGenresCount(): Observable<FavoriteGenresCount[]> {
    return this.http.get<FavoriteGenresCount[]>(`${this.currentMovieUrl}/get/user-genre-fav-count`)
  }
}