export interface MovieCommentsPage {
    content: MovieComment[]; 
    page: {
      number: number;       
      size: number;        
      totalElements: number; 
      totalPages: number;    
    };
  }
  
  export interface MovieComment {
    id: number;
    commentedMovieId: number;
    comment: string;
    commentatorName: string;
    timePosted: string;
  }
  