import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { UtilitiesService } from './services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private locationAccuracy: LocationAccuracy,
    private utils: UtilitiesService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // set status bar to white
      this.statusBar.backgroundColorByHexString('#31aa6e');
      this.splashScreen.hide();
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () =>
              this.utils.presentToast("High Accuracy Location Retrieved", "toast-info"),
            error => alert(error)
          );
        }
      }); // location accuracy closing
    });
  }
}
