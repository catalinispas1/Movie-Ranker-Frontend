import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { User } from 'src/app/models/user';
import { MovieResponse } from 'src/app/models/movie-response';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogFilterComponent } from '../alert-dialog-filter/alert-dialog-filter.component';
import { UserMovieStatisticsComponent } from 'src/app/user-movie-statistics/user-movie-statistics.component';
import { Movie } from 'src/app/models/movie';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css'],
})
export class DashboardViewComponent implements OnInit, AfterViewInit{
  constructor(private dashboardService: DashboardService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  @ViewChild('searchInput') searchInput!: ElementRef;

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.value = sessionStorage.getItem("searchedMovie");
  }
  userDetails: User | null = null
  movieResponse: MovieResponse | null = null
  queryParams: string = ""
  currentPageIndex: number = 0

  ngOnInit(): void {

    this.dashboardService.getUserDetails().subscribe({
      next: (userDetails) => {
        this.userDetails = userDetails
      }
    })

    const currentPage = sessionStorage.getItem("page");
    const savedPageIndex = currentPage ? parseInt(currentPage) - 1 : 0

    const currentPageEvent: PageEvent = {
      pageIndex: savedPageIndex,       
      pageSize: 20,       
      length: 0           
    };
    this.onPageEvent(currentPageEvent)
    
    // this is used to update the movieResponse from the alertDialog component when we click on apply (only the first page )
    this.dashboardService.movieResponse$.subscribe(response => {
      if (sessionStorage.getItem("gotBack")) {
        sessionStorage.removeItem("gotBack")
        return
      }
      this.movieResponse = response; 
      const firstPageEvent: PageEvent = {
        pageIndex: 0,       
        pageSize: 20,       
        length: 0           
      };
      this.onPageEvent(firstPageEvent)
    });
  }

  onPageEvent(event: PageEvent):void {
    this.currentPageIndex = event.pageIndex;
    const pageIndex = event.pageIndex + 1
    sessionStorage.setItem("page", pageIndex + "")

    window.scrollTo({ top: 0, behavior: `instant` });

    const searchedMovie = sessionStorage.getItem("searchedMovie")
    const filterMovie = sessionStorage.getItem("filter")

    if (sessionStorage.getItem("gettingFavMovies")) {
      this.dashboardService.getFavoriteMovies(pageIndex - 1).subscribe({
        next: (favoriteMovies) => {
          const movies: Movie[] = favoriteMovies.content.map(favMovie => ({
            adult: false, 
            backdrop_path: "",
            genre_ids: [], 
            id: favMovie.movieId,
            original_language: "", 
            original_title: favMovie.title,
            overview: "",
            popularity: 0,
            poster_path: favMovie.backdropPath,
            release_date: "",
            title: favMovie.title,
            video: false,
            vote_average: 0,
            vote_count: 0,
          }));
          this.movieResponse = {
            page: favoriteMovies.page.number,
            results: movies,
            total_pages: favoriteMovies.page.totalPages,
            total_results: favoriteMovies.page.totalElements
          }
          this.scrollToSavedPosition()
        }
      })
      return
    }


    if ((searchedMovie === "" || searchedMovie === null) && (filterMovie === "" || filterMovie === null)){    
      this.dashboardService.getMovieList(pageIndex, this.queryParams).subscribe({
        next: (movieResponse) => {
          this.movieResponse = movieResponse
          this.scrollToSavedPosition()
        }
      })
    } else if ((searchedMovie !== "" || searchedMovie !== null) && (filterMovie === "" || filterMovie === null)){
      this.dashboardService.getSearchedMovies(pageIndex, searchedMovie || "").subscribe({
        next: (movieResponse) => {
          this.movieResponse = movieResponse
          this.scrollToSavedPosition()
        }
      })
    } else {
      this.dashboardService.getFilteredMovies(pageIndex, filterMovie || "").subscribe({
        next: (movieResponse) => {
          this.movieResponse = movieResponse
          this.scrollToSavedPosition()
        }
      })
    }
  }

  saveScrollPosition(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; 
    const scrollPercentage = (scrollPosition / scrollHeight) * 100; 
    sessionStorage.setItem("scrollPercentage", scrollPercentage.toString());
  }

  scrollToSavedPosition(): void {
    if (sessionStorage.getItem("scrollPercentage")) {
      setTimeout(() => {
        const scrollPercentage = parseFloat(sessionStorage.getItem("scrollPercentage") || "0");
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; 
        const scrollPosition = (scrollPercentage / 100) * scrollHeight;
        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        sessionStorage.removeItem("scrollPercentage");
      }, 10);
    }
  }
  
  onSearchSubmit(searchedMovie: string):void {
    sessionStorage.clear()
    sessionStorage.setItem("searchedMovie", searchedMovie)
    const firstPageEvent: PageEvent = {
      pageIndex: 0,       
      pageSize: 20,       
      length: 0           
    }
    this.onPageEvent(firstPageEvent)
  }

  showFilterDialog(): void {
    const dialogRef = this.dialog.open(AlertDialogFilterComponent, {
      width: '600px', 
    })
  }

  showUserStatisticsDialog(): void {
    this.dialog.open(UserMovieStatisticsComponent, {
      width: '600px',
    })
  }

  getFavoriteMovies(): void {
    sessionStorage.clear()
    sessionStorage.setItem("gettingFavMovies", "true")
    const firstPageEvent: PageEvent = {
      pageIndex: 0,       
      pageSize: 20,       
      length: 0           
    }
    this.onPageEvent(firstPageEvent)
  }

  refreshPage(): void {
    sessionStorage.clear()
    this.ngOnInit()
  }

  logout(): void {
    sessionStorage.clear()
    localStorage.clear()
    this.router.navigateByUrl('/login', { replaceUrl: true })
  }
}
