import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public userListRef: AngularFirestoreCollection<any>;
  // public userId: string;
  constructor(
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.afAuth.authState.subscribe(user => {
      // this.userId = user.uid;
      this.userListRef = this.firestore.collection(`/users`);
    });
  }

  getUserList(): AngularFirestoreCollection<any> {
    return this.userListRef;
  }

  getUserDetail(uid: string): AngularFirestoreDocument<any> {
    return this.firestore.doc(`/users/${uid}`);
  }

  removeUser(userId: string): Promise<any> {
    return this.userListRef.doc(userId).delete();
  }

  payUser(userId: string): Promise<any> {
    return this.userListRef.doc(userId).update({ paid: true });
  }



}
