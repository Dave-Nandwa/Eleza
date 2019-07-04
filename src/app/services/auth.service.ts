import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  specificUser: any;
  user: any;
  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    private toastCtrl: ToastController, ) { }

  async presentToast(message) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'bottom'
    });
    await toast.present();
  }

  getUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  loginUser(newEmail: string, newPassword: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  fingerprintLogin(fid: string) {
    this.specificUser = this.firestore.collection("users", ref => ref.where("fingerPrintId", '==', fid)).valueChanges();
    this.specificUser.pipe(catchError(err => this.presentToast("Error, please try again"))).subscribe(async users => {
      this.user = users[0];
      // For debugging purposes only
      // console.log("this is the user:" + this.user.email);
      this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.pwd);
    });
  }

  anonymousLogin(): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInAnonymously();
  }

  linkAccount(email: string, password: string): Promise<any> {
    const credential = firebase.auth.EmailAuthProvider.credential(email,
      password);
    return this.afAuth.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(
        userCredential => {
          this.firestore.doc(`/userProfile/${userCredential.user.uid}`).update({
            email
          });
        },
        error => {
          console.log('There was an error linking the account', error);
        });
  }

  signupUser(name: string, email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.auth.UserCredential) => {
        firebase
          .firestore()
          .doc(`/users/${newUserCredential.user.uid}`)
          .set({
            full_name: name,
            email: email,
            pwd: password,
            id: newUserCredential.user.uid,
          });
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

}
