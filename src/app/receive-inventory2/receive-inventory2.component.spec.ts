import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveInventory2Component } from './receive-inventory2.component';

describe('ReceiveInventory2Component', () => {
  let component: ReceiveInventory2Component;
  let fixture: ComponentFixture<ReceiveInventory2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveInventory2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveInventory2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
