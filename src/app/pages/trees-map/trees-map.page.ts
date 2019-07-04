import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {EventsService} from '../../services/events.service';
import {UtilitiesService} from '../../services/utilities.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
//MapBoxGl
import '../../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import * as mapboxgl from '../../../../node_modules/mapbox-gl';
import {MapService} from '../../services/map.service';
import {GeoJson, FeatureCollection} from '../../map';

@Component({selector: 'app-trees-map', templateUrl: './trees-map.page.html', styleUrls: ['./trees-map.page.scss']})
export class TreesMapPage implements OnInit {

    //Mapbox Variables
    map : mapboxgl.Map;
    style = 'mapbox://styles/dnandwa/cjxn35gd301m11cmtg99dspu2';
    lat = -1.28333;
    lng = 36.81667;
    message = 'Hello World!';
 
    // data
    source : any;
    markers : any;
    marker : any;

    public treesList : Observable < any >;
    public treeList : any[];
    public loadedTreeList : any[];
    arrayOfTrees : any[];
    geojson : {};
    constructor(private mapService : MapService, private geolocation : Geolocation, private eventsService : EventsService, private utils : UtilitiesService, private router : Router, private firestore : AngularFirestore) {}

    ngOnInit() {
        this.utils.presentLoading("Retrieving trees...");
        this.treesList = this.mapService.getTreeList().valueChanges();
        this.treesList.subscribe(res => {
                this.arrayOfTrees = [];
                res.forEach(tree => {
                    console.log(tree);
                    this.arrayOfTrees.push({id: tree.id, latitude: tree.latitude, longitude: tree.longitude});
                    const coords = [tree.longitude, tree.latitude];
                    //Add the coords to the geojson file
                    this.mapService.geojson.source.data.features.push({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": coords
                    }});
                });
                this.utils
                    .dismissLoading();
                console.log("Gotten Everything")
            }, err => alert(err));
        // this.openLayersdisplayMap();
        this.initMap();
    }

    initMap() {
        this.geolocation.getCurrentPosition().then((resp) => {
                this.lat = resp.coords.latitude;
                this.lng = (resp.coords.longitude);
                console.log("I'm in the init function now")
                this.map.flyTo({
                    center: [this.lng, this.lat]
                });
            }).catch((error) => {
                // TypeError: failed to get user Location
                alert(error);
                this.utils.presentToast("We couldn't find you, please turn on your GPS.", "toast-error");
            });
        this.buildMap();
    }

    buildMap() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 12,
            center: [this.lng, this.lat]
        });
        /// Add map controls
        this.map.addControl(new mapboxgl.NavigationControl());
        this.addMarkers();
    }

    addMarkers() {
        /// Add realtime firebase data on map load
        this.map.on('load', (event) => {
            this.map.loadImage('../../../assets/img/tree-marker.png', (error, image) => {
                if (error) throw error;
                this.map.addImage('marker', image);
                this.map.addLayer(this.mapService.geojson);
            });
    });
    }

}
