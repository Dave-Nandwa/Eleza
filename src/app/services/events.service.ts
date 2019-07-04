import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root',
}) 
export class EventsService {
  public userTreesCount: AngularFirestoreCollection<any>;
  public userListRef: AngularFirestoreCollection<any>;
  public treesListRef: AngularFirestoreCollection<any>;
  public totalTrees: AngularFirestoreCollection<any>;
  public userId: string;
  constructor(
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      this.userTreesCount = this.firestore.collection(`/users/${user.uid}/trees`);
      // this.userListRef = this.firestore.collection(`/users/`);
      this.treesListRef = this.firestore.collection(`/trees/`);
      this.totalTrees = this.firestore.collection(`/total/`);
    });
  }

  async addUserTree(
    lat: string,
    lng: string,
  ): Promise<any> {
    const newuserTreesCount: firebase.firestore.DocumentReference = await
      this.userTreesCount.add({});
    return newuserTreesCount.update({
      latitude:lat,
      longitude: lng,
      id: newuserTreesCount.id,
    });
  }

  async addGeneralTree(
    lat: string,
    lng: string,
    user: string
  ): Promise<any> {
    const newTree: firebase.firestore.DocumentReference = await
      this.treesListRef.add({});
    return newTree.update({
      latitude:lat,
      longitude: lng,
      id: newTree.id,
      userId: user
    });
  }

  addDeparture(
    coords: string,
    eventId: string,
    departure: string,
  ): Promise<any> {
    return this.userTreesCount.doc(eventId)
      .update({
        finished: true,
        departure_location: coords,
        departure: departure
      });
  }

  addTotal(): Promise<any> {
    console.log("Added Tree to Database.");
    return this.totalTrees.doc("B5GWlQY7Wn8P5ORTuM3v").update({
      numberOfTrees: firebase.firestore.FieldValue.increment(1),
    });
  }
 
  getUserTreeList(): AngularFirestoreCollection<any> {
    return this.userTreesCount;
  }

  getUserTrees(uid: string): AngularFirestoreCollection<any> {
    return this.firestore.collection(`/users/${uid}/trees/`);
  }

  getTotal(): AngularFirestoreCollection<any> {
    return this.totalTrees;
  }

  removeTree(eventId: string): Promise<any> {
    return this.userTreesCount.doc(eventId).delete();
  }



}
