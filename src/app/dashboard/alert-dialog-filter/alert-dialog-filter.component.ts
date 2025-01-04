import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-alert-dialog-filter',
  templateUrl: './alert-dialog-filter.component.html',
  styleUrls: ['./alert-dialog-filter.component.css'],
})
export class AlertDialogFilterComponent implements OnInit{
  filterForm: FormGroup;
  genres = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
  ];
  selectedGenres: number[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AlertDialogFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dashboardService: DashboardService
  ) {
    this.filterForm = this.fb.group({
      sort_by: ['popularity.desc'],
      primary_release_year: [''],
      include_adult: [false],
    });

    if (data?.genres) {
      this.selectedGenres = data.genres;
    }
  }

  ngOnInit(): void {
    const storedFilter = sessionStorage.getItem('filter');
    if (storedFilter) {
      const params = new URLSearchParams(storedFilter);

      this.filterForm.patchValue({
        sort_by: params.get('sort_by'),
        primary_release_year: params.get('primary_release_year'),
        include_adult: params.get('include_adult') === 'true'
      });

      const storedGenres = params.get('with_genres');
      if (storedGenres) {
        this.selectedGenres = storedGenres.split(',').map(Number);
      }
    }
  }

  onGenreChange(event: any) {
    const genreId = event.source.value;
    if (event.checked) {
      this.selectedGenres.push(genreId);
    } else {
      this.selectedGenres = this.selectedGenres.filter((id) => id != genreId);
    }
    console.log(this.selectedGenres);
    
  }

  clearFilters() {
    this.filterForm.reset({
      sort_by: 'popularity.desc',
      primary_release_year: '',
      include_adult: false,
    });
    this.selectedGenres = [];


  }

  applyFilters() {
    const filters = this.filterForm.value;
    filters.genres = this.selectedGenres;
    console.log(filters);

    sessionStorage.clear()

    let genres = this.selectedGenres.join(',')

    let queryParams = "sort_by=" + filters.sort_by + "&primary_release_year=" + filters.primary_release_year + "&with_genres=" + genres + "&include_adult=" + filters.include_adult
    console.log(queryParams);

    this.dialogRef.close(filters)

    sessionStorage.setItem("filter",queryParams)

    this.dashboardService.getFilteredMovies(1, queryParams).subscribe({
      next: (movieResponse) => {
        this.dashboardService.movieResponseSubject.next(movieResponse)
      }, 
      error: () => {
        console.log("Cannot calling the API to filter");        
      }
    })
  }
}

