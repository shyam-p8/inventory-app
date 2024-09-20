import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialNumberDetailsComponent } from './serial-number-details.component';

describe('SerialNumberDetailsComponent', () => {
  let component: SerialNumberDetailsComponent;
  let fixture: ComponentFixture<SerialNumberDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialNumberDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerialNumberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
