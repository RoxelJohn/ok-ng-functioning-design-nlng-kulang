import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  fullname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';
  passwordIcon: string = 'eye-off';
  confirmPasswordIcon: string = 'eye-off';
  private _storage: Storage | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

  async register() {
    if (!this.fullname || !this.email || !this.password || !this.confirmPassword) {
      this.presentToast('Please fill in all fields before proceeding.');
      return;
    }


    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.presentToast('Please enter a valid email address.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.presentToast('Passwords do not match.');
      return;
    }

  
    if (this.password.length < 8) {
      this.presentToast('Password must be at least 8 characters long.');
      return;
    }

  
    if (this._storage) {
      await this._storage.set('fullname', this.fullname);
      await this._storage.set('email', this.email);
      await this._storage.set('password', this.password);
      this.presentToast('Registration successful! You can now log in.');
    }


    this.router.navigate(['/login']);
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

  toggleConfirmPasswordVisibility() {
    if (this.confirmPasswordType === 'password') {
      this.confirmPasswordType = 'text';
      this.confirmPasswordIcon = 'eye';
    } else {
      this.confirmPasswordType = 'password';
      this.confirmPasswordIcon = 'eye-off';
    }
  }
}
