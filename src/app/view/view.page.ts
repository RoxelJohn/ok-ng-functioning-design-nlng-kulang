import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  tasks: any[] = [];
  completedTasks: any[] = []; // Array to store completed tasks

  constructor(
    private cdRef: ChangeDetectorRef,
    private alertController: AlertController,
    private storage: Storage,
    private router: Router
  ) {}
   

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.loadTasks();      // Load tasks from storage
    await this.loadCompletedTasks(); // Load completed tasks from storage
  }

  async loadTasks() {
    const storedTasks = await this.storage.get('tasks');
    if (storedTasks) {
      this.tasks = storedTasks; // Load tasks from storage
      this.cdRef.detectChanges(); // Ensure the UI is updated
    }
  }

  async loadCompletedTasks() {
    const storedCompletedTasks = await this.storage.get('completedTasks');
    if (storedCompletedTasks) {
      this.completedTasks = storedCompletedTasks; // Load completed tasks from storage
      this.cdRef.detectChanges(); // Ensure the UI is updated
    }
  }

  async markTasksAsDone() {
    this.tasks.forEach((task, index) => {
      if (task.selected) {
        task.done = true; // Mark the task as done
        task.selected = false; // Deselect the checkbox
        this.completedTasks.push(task); // Move the task to completed tasks
        this.tasks.splice(index, 1); // Remove the task from the active tasks array
      }
    });

    await this.saveTasks(); // Save updated tasks to storage
    await this.saveCompletedTasks(); // Save completed tasks to storage
    this.cdRef.detectChanges(); // Trigger change detection
  }

  async saveTasks() {
    await this.storage.set('tasks', this.tasks); // Save tasks to storage
  }

  async saveCompletedTasks() {
    await this.storage.set('completedTasks', this.completedTasks); // Save completed tasks to storage
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Optional: Add any logic if needed when canceling
          }
        },
        {
          text: 'Log Out',
          handler: () => {
            this.router.navigate(['/screen']); // Navigate to the login or welcome screen
          }
        }
      ]
    });

    await alert.present();
  }


  loadMoreTasks(event: any) {
    // Implement load more logic if needed
  }
}