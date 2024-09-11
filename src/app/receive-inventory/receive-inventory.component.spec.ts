import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveInventoryComponent } from './receive-inventory.component';

describe('ReceiveInventoryComponent', () => {
  let component: ReceiveInventoryComponent;
  let fixture: ComponentFixture<ReceiveInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
