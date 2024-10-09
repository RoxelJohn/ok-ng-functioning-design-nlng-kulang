import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHistoryPage } from './dashboard-history.page';

describe('DashboardHistoryPage', () => {
  let component: DashboardHistoryPage;
  let fixture: ComponentFixture<DashboardHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
