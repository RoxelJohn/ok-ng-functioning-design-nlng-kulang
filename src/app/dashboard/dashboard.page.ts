import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  tasks: any[] = [];
  avatarUrl: string | ArrayBuffer | null = null;
  fullname: string = '';
  email: string = '';
  currentPage: number = 0; // Initialize current page
  tasksPerPage: number = 10; // Set the number of tasks to load per page
  totalTasks: number = 0; // Track total number of tasks

  constructor(
    private storage: Storage,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private menuController: MenuController,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.loadTasks();      // Load tasks from storage

    const savedAvatar = await this.storage.get('avatarUrl');
    if (savedAvatar) {
      this.avatarUrl = savedAvatar; // Load avatar from storage
    }

    this.route.queryParams.subscribe((params) => {
      this.fullname = params['fullname'];
      this.email = params['email'];
    });
  }

  async loadTasks() {
    const storedTasks = await this.storage.get('tasks');
    if (storedTasks) {
      this.tasks = storedTasks;
      this.cdRef.detectChanges(); // Ensure UI is update
    }
  }

  // Function to handle the selected image
  async onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          this.avatarUrl = e.target.result as string; // Set the avatar URL
          await this.storage.set('avatarUrl', this.avatarUrl); // Save the avatar to storage
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  // Function to upload an image
  uploadImage() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click(); // Trigger the file input click
  }

  async presentAlert() {
    const alert = await this.alertController.create({
        header: 'Add Task',
        inputs: [
            { name: 'taskInput', type: 'text', placeholder: 'Enter task title' },
            { name: 'dateInput', type: 'datetime-local' }
        ],
        buttons: [
            { text: 'Cancel', role: 'cancel' },
            {
                text: 'Add',
                handler: async (data) => {
                    if (data.taskInput && data.dateInput) {
                        const dueDate = new Date(data.dateInput);
                        const currentDate = new Date();

                        this.tasks.push({
                            title: data.taskInput,
                            scheduledDate: data.dateInput,
                            done: false,
                            selected: false,
                            overdue: dueDate < currentDate // Check if it's overdue
                        });

                        await this.saveTasks(); // Save the updated task list
                        this.cdRef.detectChanges(); // Refresh the view
                    }
                }
            }
        ]
    });
    await alert.present();
}

  // Method to update a task
  async updateTaskPrompt(index: number) {
    const alert = await this.alertController.create({
      header: 'Update Task',
      inputs: [
        { name: 'taskInput', type: 'text', value: this.tasks[index].title },
        { name: 'dateInput', type: 'datetime-local', value: this.tasks[index].scheduledDate },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: async (data) => {
            if (data.taskInput && data.dateInput) {
              this.tasks[index] = { title: data.taskInput, scheduledDate: data.dateInput, done: this.tasks[index].done }; // Update task
              await this.saveTasks(); // Save updated tasks to storage
              this.cdRef.detectChanges(); // Refresh view after updating the task
            }
          },
        },
      ],
    });

    await alert.present();
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


 // Method to delete a task with confirmation using ion-alert
async deleteTask(index: number) {
  const alert = await this.alertController.create({
    header: 'Delete Task',
    message: 'Are you sure you want to delete this task?',
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
        text: 'Delete',
        handler: async () => {
          // Proceed with the deletion if confirmed
          this.tasks.splice(index, 1); // Remove the task from the array
          this.totalTasks = this.tasks.length; // Update total task count
          await this.saveTasks(); // Save the updated task list to storage
          this.cdRef.detectChanges(); // Refresh the view
        }
      }
    ]
  });

  await alert.present();
}

  // Save tasks method
  async saveTasks() {
    await this.storage.set('tasks', this.tasks); // Save tasks to storage
  }

  // Load more tasks when infinite scroll is triggered
  loadMoreTasks(event: any) {
    const nextPage = this.currentPage + 1;
    const newTasks = this.tasks.slice(this.currentPage * this.tasksPerPage, (this.currentPage + 1) * this.tasksPerPage);

    if (newTasks.length > 0) {
      this.tasks.push(...newTasks); // Add new tasks to the list
      this.currentPage = nextPage; // Update current page
    }

    event.target.complete(); // Complete the infinite scroll event

    // Disable infinite scroll if all tasks are loaded
    if (this.tasks.length >= this.totalTasks) {
      event.target.disabled = true;
    }
  }
  goToHistory() {
    this.router.navigate(['/history'], { queryParams: { from: 'dashboard' } });
  }
  

  // Logout function
  logOut() {
    this.router.navigate(['/screen']); // Example: Navigate to login screen
  }

  // Function to close the menu
  closeMenu() {
    this.menuController.close();
  }
}
