import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventory2Component } from './add-inventory2.component';

describe('AddInventory2Component', () => {
  let component: AddInventory2Component;
  let fixture: ComponentFixture<AddInventory2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInventory2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInventory2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
