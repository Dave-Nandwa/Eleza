import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { credentials } from '../credentials';
import { GeoJson } from '../map';
import * as mapboxgl from '../../../node_modules/mapbox-gl';
 
@Injectable({
  providedIn: 'root'
})
export class MapService {
  public treesListRef: AngularFirestoreCollection<any>;
  public geojson = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.032, 38.913]
      },
      properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776]
      },
      properties: {
        title: 'Mapbox',
        description: 'San Francisco, California'
      }
    }]
  };
  constructor(
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    mapboxgl.accessToken = credentials.mapbox.ACCESS_TOKEN
    this.treesListRef = this.firestore.collection(`/trees/`);  
  }

  getTreeList(): AngularFirestoreCollection<any> {
    return this.treesListRef;
  }

}