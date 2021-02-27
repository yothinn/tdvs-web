import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFiltersDataComponent } from './search-filters-data.component';

describe('SearchFiltersDataComponent', () => {
  let component: SearchFiltersDataComponent;
  let fixture: ComponentFixture<SearchFiltersDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFiltersDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFiltersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
