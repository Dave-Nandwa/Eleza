import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {credentials} from '../credentials';
import {GeoJson} from '../map';
import * as mapboxgl from '../../../node_modules/mapbox-gl';

@Injectable({providedIn: 'root'})
export class MapService {
    public treesListRef : AngularFirestoreCollection < any >;
    public geojson = {
        "id": "points",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [
                        {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [0, 0]
                        }
                    }
                ]
            }
        },
        "layout": {
            "icon-image": "marker",
            "icon-size": 0.10
        }
    };
    constructor(public afAuth : AngularFireAuth, private firestore : AngularFirestore) {
        mapboxgl.accessToken = credentials.mapbox.ACCESS_TOKEN
        this.treesListRef = this
            .firestore
            .collection(`/trees/`);
    }

    getTreeList() : AngularFirestoreCollection < any > {
        return this.treesListRef;
    }

}