import React, { Component } from 'react';
import './MapWrapper.css';
import MarkerClusterer from "@google/markerclusterer"
const google = window.google;

class MapWrapper extends Component {
  state = {
    map: null,
    zoom: 13,
    maptype: 'roadmap',
    data: null,
    userMarkerCoord: {lat: 37.773972, lng: -122.431297},
    markers: [],
    activeMarker: null,
    infoWindowOpen: false,
    activeInfoWindow: null,
  }

  componentDidMount() {
    this.createMap()

  }

  componentDidUpdate(){
   // this.loopMarkers(this.state.map);
  }

  createMap(callback){
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.773972, lng: -122.431297},
      zoom: 13,
      mapTypeId: 'roadmap',
    });

    this.setState({
      map: map,
    }, 
      () => this.loopMarkers(this.state.map),
    );
    
    let userMarker = new window.google.maps.Marker({
      map: map,
      position: {lat: 37.773972, lng: -122.431297},
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        scaledSize: new google.maps.Size(45, 45),
      }
    });
    
    google.maps.event.addListener(userMarker, 'click', (e)=> {
      this.setState({
        activeMarker: userMarker
      });
      let infowindow = new google.maps.InfoWindow({
        content: 'test string'
      });
      this.displayInfoWindow(map, userMarker, infowindow, e)
    });
  
    map.addListener('zoom_changed', () => {
      this.setState({
        zoom: map.getZoom(),
       });
    });

    map.addListener('maptypeid_changed', () => {
      this.setState({
        maptype: map.getMapTypeId(),
      });
    });
    
    map.addListener('click', (e) =>{
      this.placeMarker(e.latLng, map, userMarker);
    });  
   
  }

  placeMarker(latLng, map, userMarker) {
    this.setState({
      userMarkerCoord: latLng,
    });
    console.log(this.state.userMarkerCoord)
    userMarker.setPosition(this.state.userMarkerCoord)
  }

    
  displayInfoWindow(map, marker, infowindow, e){
    if (this.state.activeInfoWindow){
      this.state.activeInfoWindow.close()
    } 

    infowindow.open(map, this.state.activeMarker);
      this.setState({
        infoWindowOpen: true,
        activeInfoWindow: infowindow,
      });
    
    infowindow.addListener('closeclick', (e) =>{
      infowindow.close();
        this.setState({
          infoWindowOpen: false,
          activeInfoWindow: null,
        });
    });
  }
  
  loopMarkers(map) {
    if (this.state.map !== null){
      let newMarkerArray =[]
      for (let item of this.props.data) {
        console.log("item is:", item);
        let coords = item.geometry.coordinates
        let latLng = new google.maps.LatLng(coords[0],coords[1]);
        console.log("map for marker is:", map)
        console.log("latlng for marker is:", latLng)
        let marker = new google.maps.Marker({
          map: map,
          position: latLng,
        });
        console.log("new marker:", marker)
        let infowindow = new google.maps.InfoWindow({
          content: 'test string'
        });
        google.maps.event.addListener(marker, 'click', (e)=> {
          this.setState({
            activeMarker: marker
          });
          this.displayInfoWindow(this.state.map, marker, infowindow, e)
        });
        newMarkerArray=newMarkerArray.concat(marker)

      }
      this.setState({
        markers: newMarkerArray
      },
      () => this.creatMarkeCluster(this.state.markers),
      );
    

    } else {
      console.log("map didn't pass")
    }
  }

  creatMarkeCluster(markers){
    console.log("this.state.markers:", this.state.markers)
    console.log("get map", this.state.map)
    let zoom = parseInt(this.state.map.zoom.value, 10);
    let size = parseInt(this.state.map.value, 10);
    zoom = zoom == -1 ? null : zoom;
    size = size == -1 ? null : size;
    let markerCluster = new MarkerClusterer(this.state.map, this.state.markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        maxZoom: zoom,
        gridSize: size,
      });
  }
  createMarker(latLng, map) {

  }

  render() {
    return (
      <div id='app'>
        <div id='map' />
      </div>
    );
  }
}

export default MapWrapper;

