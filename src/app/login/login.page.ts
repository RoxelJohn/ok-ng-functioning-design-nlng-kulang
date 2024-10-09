import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  fullname: string = '';
  email: string = '';
  password: string = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  private _storage: Storage | null = null;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    this._storage = await this.storage.create();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  async validateInputs() {
    if (!this.email || !this.password) {
      this.presentToast('Please fill in both email and password fields.');
      return;
    }

    if (!this.email.includes('@gmail.com')) {
      this.presentToast('Your email must be a Gmail address.');
      return;
    }

    if (!this._storage) {
      this.presentToast('Storage is not initialized properly.');
      return;
    }

    const storedEmail = await this._storage.get('email');
    const storedPassword = await this._storage.get('password');
    this.fullname = await this._storage.get('fullname');

    if (!storedEmail || !storedPassword) {
      this.presentToast('No registered user found. Please register first.');
      return;
    }

    if (this.email !== storedEmail || this.password !== storedPassword) {
      this.presentToast('Invalid email or password. Please try again.');
      return;
    }

    this.Dashboard();
  }

  Dashboard() {
    this.router.navigate(['/dashboard'], {
      queryParams: {
        fullname: this.fullname,
        email: this.email,
      },
    });
  }

  Registration() {
    this.router.navigate(['/registration']);
  }


  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }
}
