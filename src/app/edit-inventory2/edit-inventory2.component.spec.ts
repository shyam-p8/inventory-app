import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInventory2Component } from './edit-inventory2.component';

describe('EditInventory2Component', () => {
  let component: EditInventory2Component;
  let fixture: ComponentFixture<EditInventory2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInventory2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInventory2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
