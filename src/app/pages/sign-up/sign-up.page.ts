import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilitiesService } from '../../services/utilities.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  public signupForm: FormGroup;
  fingerPrintID: any;
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utils: UtilitiesService
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6),
      Validators.required])],
    });
  }



  async signupUser(signupForm): Promise<void> {
    let loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    try {
      loading.present();
      const name: string = signupForm.value.name;
      const email: string = signupForm.value.email;
      const password: string = signupForm.value.password;
      await this.authService.signupUser(name, email, password);
      await loading.dismiss();
      this.router.navigateByUrl('/login');
    } catch (error) {
      await loading.dismiss();
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



  ngOnInit() { }
}
