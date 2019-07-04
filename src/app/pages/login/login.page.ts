import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public problem: boolean;
  fingerPrintID: any;
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utils: UtilitiesService
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }

  async loginUser(loginForm): Promise<void> {
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    try {
      loading.present();
      const email: string = loginForm.value.email;
      const password: string = loginForm.value.password;
      await this.authService.loginUser(email, password);
      await loading.dismiss();
      this.router.navigateByUrl('/home');
    } catch (error) {
      await loading.dismiss();
      this.problem = true;
      const alert = await this.alertCtrl.create({
        message: error.message,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
          },
        ],
      });
      alert.present();
    }
  }

  ngOnInit() {
  }

}
