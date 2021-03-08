import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularSubredditsComponent } from './popular-subreddits.component';

describe('PopularSubredditsComponent', () => {
  let component: PopularSubredditsComponent;
  let fixture: ComponentFixture<PopularSubredditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopularSubredditsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularSubredditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
