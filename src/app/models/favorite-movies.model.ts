export interface FavoriteMovie {
    id: number;
    movieId: number;
    title: string;
    backdropPath: string;
  }
  
  export interface Page {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
  
  export interface FavoriteMoviesResponse {
    content: FavoriteMovie[];
    page: Page;
  }
  