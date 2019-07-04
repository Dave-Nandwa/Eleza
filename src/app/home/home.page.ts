import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AlertController, ActionSheetController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {UtilitiesService} from '../services/utilities.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ProfileService} from '../services/profile.service';
import {EventsService} from '../services/events.service';
 
//Geolocation Providers
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({selector: 'app-home', templateUrl: 'home.page.html', styleUrls: ['home.page.scss']})
export class HomePage {
    userProfile : any;
    latitude:any;
    longitude:any;
    total:any;
    coords:any;
    numOfTrees:any;
    constructor(
      private alertCtrl : AlertController,
       private authService : AuthService,
        private profileService : ProfileService,
         private eventsService : EventsService,
          private utils : UtilitiesService,
           private router : Router,
            private acr : ActivatedRoute,
             private geolocation: Geolocation,
              private locationAccuracy: LocationAccuracy,) {}

    ionViewWillEnter() {
        this.utils.presentLoading("Syncing...").then(() => {
          this.getLocation();
        });
        this.profileService
            .getUserProfile()
            .get()
            .then(userProfileSnapshot => {
                this.userProfile = userProfileSnapshot.data();
                this
                    .utils
                    .dismissLoading();
                console.log(this.userProfile.full_name);
            });
            this.allTrees();
    };

    plant() {
      if (this.latitude !== undefined && this.longitude !== undefined) {
        //Adds Collection under specific user
        this.eventsService.addUserTree(this.latitude,this.longitude).then(() => {
          //Adds Document under general trees collection
          this.eventsService.addGeneralTree(this.latitude,this.longitude, this.userProfile.id).then(() => {
            //Increments Number of Trees
            this.eventsService.addTotal().then(() => {
              this.utils.presentToast("Planted.", "toast-success");
            }).catch(err => alert(err)); // Error: failed to increment total;
          }).catch(err => alert(err)); // Error: failed to post to global trees;  
        }).catch(err => alert(err)); // Error: failed to post to user trees;  
      } else {
        this.utils.presentToast("We couldn't find you, please turn on your GPS.", "toast-error");
      }
    };

    allTrees() {
      this.total = this.eventsService.getTotal().valueChanges();
      this.total.subscribe(res => {
        res.forEach(count => {
          console.log(count);
          this.numOfTrees = count.numberOfTrees;
      });
      });
    } 

    getLocation() {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = (resp.coords.longitude);
        // this.coords = ("[http://maps.google.com/maps?q=" + this.latitude + "+" + this.longitude + "]");
        this.utils.presentToast("GeoData Received.", "toast-info");
      }).catch((error) => {
        // TypeError: failed to get user Location  
        alert(error);
        this.utils.presentToast("We couldn't find you, please turn on your GPS.", "toast-error");
      });
    }

    //Kill User Session
    logOut() : void {
      this.utils.presentToast("Goodbye.", "toast-info");
        this.authService
            .logoutUser()
            .then(() => {
                this.router
                    .navigateByUrl('landing');
            });
    }

}
