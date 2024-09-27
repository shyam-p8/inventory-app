import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingRetirementsComponent } from './upcoming-retirements.component';

describe('UpcomingRetirementsComponent', () => {
  let component: UpcomingRetirementsComponent;
  let fixture: ComponentFixture<UpcomingRetirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingRetirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingRetirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
