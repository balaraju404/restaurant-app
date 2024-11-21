import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResDetailsPage } from './res-details.page';

describe('ResDetailsPage', () => {
  let component: ResDetailsPage;
  let fixture: ComponentFixture<ResDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
