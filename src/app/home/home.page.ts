import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private loadingController: LoadingController, private navController: NavController) {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 3000,
    });

    await loading.present();

  
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed! Navigating to login page...');
    this.navController.navigateForward('/screen'); 
  }

 
  ionViewDidEnter() {
    this.presentLoading();
  }
}

