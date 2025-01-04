import { Component, OnInit, HostListener } from '@angular/core';
import { MovieDetails } from 'src/app/models/movie-details';
import { MovieServiceService } from '../movie-service.service';
import { ActivatedRoute } from '@angular/router';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { DisplayedComments } from 'src/app/models/displayedComments';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})

export class MovieDetailsComponent implements OnInit{
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    setTimeout(() => {
      window.history.pushState(null, '', window.location.href);
    }, 10);
  }
  

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
      event.preventDefault();
      console.log("Refresh blocked!");
    }
  }

  currentMovie: MovieDetails | null = null
  constructor (private movieService: MovieServiceService,
    private route: ActivatedRoute
  ) {}
  movieId: string | null = ""
  isFavorite: boolean = false
  addToFavText: string = "Add to Favorites"
  rateText: string = "Rate this movie"
  faStar = faStar
  totalStars = 5;
  selectedStars = 0; 
  hoveredStars = 0;
  currentComment: string = "" 
  displayedComments: DisplayedComments[] = []
  averageMovieRating: number = 0.0
  loadCommentsButtonVisibility: boolean = true
  currentCommentPage: number = 0

  ngOnInit(): void {
    sessionStorage.setItem("gotBack", "true")
    this.movieId = this.route.snapshot.queryParamMap.get('movie_id')
    this.movieService.getCurrentMovie(this.movieId).subscribe({
      next: (currentMovie) => {
        this.currentMovie = currentMovie
        console.log(this.currentMovie);
      },
      error: () => {
        console.log("Error getting the current movie");
      }
    })

    this.movieService.isFavorite(this.movieId).subscribe({
      next: (isFav) => {
        this.isFavorite = isFav
        if (this.isFavorite) {
          this.addToFavText = "Remove from Favorites"
        } else {
          this.addToFavText = "Add to Favorites"
        }
      },
      error: () => {
        console.log("Error getting the favorite status");
      }
    })

    this.movieService.getMovieRating(this.movieId).subscribe({
      next: (rating) => {
        this.selectedStars = rating
        if (rating > 0) {
          this.rateText = rating + "/5 stars rated by you"
        }
      },
      error: () => {
        console.log("Error getting the rating")
      }
    })

    this.movieService.getAverageRating(this.movieId).subscribe({
      next: (averageMovieRating) => {
        this.averageMovieRating = averageMovieRating
        console.log("Average rating is " + averageMovieRating);
      },
      error: () => {
        console.log("Error getting the average rating")
      }
    })
    this.getComments(this.currentCommentPage)
  }


  toggleFavorite() {
    if (this.isFavorite) {
      this.movieService.removeFromFavorites(this.movieId).subscribe({
        next: () => {
          console.log("Removed from favorites")
        },
        error: () => {
          console.log("Error removing from favorites")
        }
      })
    }
    else {
      this.movieService.addToFavorites(this.movieId, this.currentMovie?.poster_path, this.currentMovie?.title).subscribe({
        next: () => {
          console.log("Added to favorites");
        },
        error: () => {
          console.log("Error adding to favorites")
        }
      })
    }

    this.isFavorite = !this.isFavorite
    if (this.isFavorite) {
      this.addToFavText = "Remove from Favorites"
    } else {
      this.addToFavText = "Add to Favorites"
    }

  }

  selectRating(stars: number) {
    this.selectedStars = stars;
    this.rateText = stars + "/5 stars rated by you"
    this.movieService.rateMovie(this.movieId, stars).subscribe({
      next: () => {
        console.log("Rated the movie");
      },
      error: () => {
        console.log("Error rating the movie")
      }
    })
  }

  hoverRating(stars: number) {
    this.hoveredStars = stars;
  }

  resetHover() {
    this.hoveredStars = 0;
  }

  postComment(comment: string) {
    if (comment === "") {
      return
    }
    this.movieService.postMovieComment(this.movieId, comment).subscribe({
      next: () => {
        this.currentComment = ""
        this.displayedComments.unshift({
          id: 0,
          commentedMovieId: 0,
          comment: comment,
          commentatorName: "Just Posted By You",
          timePosted: "",
          currentPage: 0,
          totalPages: 0
        })
      },
      error: () => {
        console.log("Error posting comment")
      }
    })
  }

  getComments(page: number) {
    this.movieService.getMovieComments(this.movieId, page).subscribe({
      next: (commentsResponse) => {
        if (!commentsResponse || !commentsResponse.content || commentsResponse.content.length === 0) {
          this.loadCommentsButtonVisibility = false          
          return
        }
        
        this.displayedComments.push (...commentsResponse.content.map((comment) => {
          const date = new Date(comment.timePosted); // Transformă string-ul în obiect Date
          const formattedDate = date.toLocaleString('en-UK', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
          }); 
          return {
            id: comment.id,
            commentedMovieId: comment.commentedMovieId,
            comment: comment.comment,
            commentatorName: comment.commentatorName,
            timePosted: formattedDate,
            currentPage: commentsResponse.page.number,
            totalPages: commentsResponse.page.totalPages
          }
        }))
        if (this.displayedComments[this.displayedComments.length - 1].currentPage + 1 === this.displayedComments[this.displayedComments.length - 1].totalPages) {
          this.loadCommentsButtonVisibility = false
        }
        this.currentCommentPage++        
      },
      error: () => {
        console.log("Error getting the comments")
      }
    })
  }
}
