import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.page.html',
  styleUrls: ['./screen.page.scss'],
})
export class ScreenPage {

  constructor(private router: Router) { }

  goToScreenPage() {
    this.router.navigate(['/registration']);
  }

}
