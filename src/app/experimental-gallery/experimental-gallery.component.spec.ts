import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentalGalleryComponent } from './experimental-gallery.component';

describe('ExperimentalGalleryComponent', () => {
  let component: ExperimentalGalleryComponent;
  let fixture: ComponentFixture<ExperimentalGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentalGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentalGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
