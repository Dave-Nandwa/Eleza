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
    style = 'mapbox://styles/mapbox/outdoors-v9';
    lat = -1.28333;
    lng = 36.81667;
    message = 'Hello World!';

    // data
    source : any;
    markers : any;

    public treesList : Observable < any >;
    public treeList : any[];
    public loadedTreeList : any[];
    arrayOfTrees : any[];
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
                });
                this
                    .utils
                    .dismissLoading();
                console.log("Gotten Everything")
            }, err => alert(err));
        // this.openLayersdisplayMap();
    }

    ngAfterViewInit() {
        this.initMap();
    }

    initMap() {
        this.geolocation.getCurrentPosition().then((resp) => {
                this.lat = resp.coords.latitude;
                this.lng = (resp.coords.longitude);
                console.log("I'm in the init function now")
                this
                    .map
                    .flyTo({
                        center: [this.lng, this.lat]
                    });
            })
            .catch((error) => {
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
            zoom: 9,
            center: [this.lng, this.lat]
        });
        /// Add map controls
        this.map.addControl(new mapboxgl.NavigationControl());
    }

    addMarkers() {
      // add markers to map
      this.mapService.geojson.features.forEach(function(marker) {
        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(this.map);
      });
    }

}
