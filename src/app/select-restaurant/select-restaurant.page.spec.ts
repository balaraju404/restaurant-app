import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectRestaurantPage } from './select-restaurant.page';

describe('SelectRestaurantPage', () => {
  let component: SelectRestaurantPage;
  let fixture: ComponentFixture<SelectRestaurantPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRestaurantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
