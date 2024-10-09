import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-dashboard-history',
  templateUrl: './dashboard-history.page.html',
  styleUrls: ['./dashboard-history.page.scss'],
})
export class DashboardHistoryPage implements OnInit {
  completedTasks: any[] = [];

  constructor(
    private storage: Storage,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  goToView() {
    this.router.navigate(['/dashboard']);
  }

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.loadCompletedTasks(); // Load completed tasks
  }

  async loadCompletedTasks() {
    const storedCompletedTasks = await this.storage.get('completedTasks');
    if (storedCompletedTasks) {
      this.completedTasks = storedCompletedTasks; // Load completed tasks
      this.cdRef.detectChanges(); // Ensure UI is updated
    }
  }

  async clearHistory() {
    await this.storage.remove('completedTasks'); // Remove the completed tasks from storage
    this.completedTasks = []; // Clear the local array
    this.cdRef.detectChanges(); // Update the UI
  }
  
}
