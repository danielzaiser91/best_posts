import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestMemeComponent } from './best-meme.component';

describe('BestMemeComponent', () => {
  let component: BestMemeComponent;
  let fixture: ComponentFixture<BestMemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestMemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestMemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
