import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogFilterComponent } from './alert-dialog-filter.component';

describe('AlertDialogFilterComponent', () => {
  let component: AlertDialogFilterComponent;
  let fixture: ComponentFixture<AlertDialogFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertDialogFilterComponent]
    });
    fixture = TestBed.createComponent(AlertDialogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
