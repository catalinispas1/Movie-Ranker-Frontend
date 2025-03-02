import { Component, OnInit } from '@angular/core';
import { FavoriteGenresCount } from '../models/favoriteGenresCount';
import { StatisticsServiceService } from './service/statistics-service.service';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-movie-statistics',
  templateUrl: './user-movie-statistics.component.html',
  styleUrls: ['./user-movie-statistics.component.css']
})
export class UserMovieStatisticsComponent {
  favoriteMoviesCount: number = 0
  averageRating: number = 0
  totalCommentsPosted: number = 0
  favoriteGenresCount: FavoriteGenresCount[] = []

  constructor(private http: HttpClient, 
    private statisticsService: StatisticsServiceService,
    public dialogRef: MatDialogRef<UserMovieStatisticsComponent>) {}


  ngOnInit(): void {
    this.statisticsService.getFavoriteMoviesCount().subscribe({
      next: (count) => {
        this.favoriteMoviesCount = count
      },
      error: () => {
        console.log("Error getting the favorite movies count")
      }
    })

    this.statisticsService.getAverageRating().subscribe({
      next: (rating) => {
        this.averageRating = rating
      },
      error: () => {
        console.log("Error getting the average rating")
      }
    })

    this.statisticsService.getTotalCommentsPosted().subscribe({
      next: (comments) => {
        this.totalCommentsPosted = comments
      },
      error: () => {
        console.log("Error getting the total comments posted")
      }
    })

    this.statisticsService.getFavoriteGenresCount().subscribe({
      next: (genres) => {
        this.favoriteGenresCount = genres
      },
      error: () => {
        console.log("Error getting the favorite genres count")
      }
    })
  }

  closeDialog() : void {
    this.dialogRef.close()
  }
}
