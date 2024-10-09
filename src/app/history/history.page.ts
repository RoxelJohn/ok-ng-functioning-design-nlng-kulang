import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  completedTasks: any[] = [];

  constructor(
    private storage: Storage,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  goToView(){
    this.router.navigate(['/view']);
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

}
