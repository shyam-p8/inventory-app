import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueInventory2Component } from './issue-inventory2.component';

describe('IssueInventory2Component', () => {
  let component: IssueInventory2Component;
  let fixture: ComponentFixture<IssueInventory2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueInventory2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueInventory2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
