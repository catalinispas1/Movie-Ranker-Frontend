import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMovieStatisticsComponent } from './user-movie-statistics.component';

describe('UserMovieStatisticsComponent', () => {
  let component: UserMovieStatisticsComponent;
  let fixture: ComponentFixture<UserMovieStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMovieStatisticsComponent]
    });
    fixture = TestBed.createComponent(UserMovieStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
