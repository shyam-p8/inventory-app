import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueInventoryComponent } from './issue-inventory.component';

describe('IssueInventoryComponent', () => {
  let component: IssueInventoryComponent;
  let fixture: ComponentFixture<IssueInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
