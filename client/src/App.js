/* global google */

import React, { Component } from 'react';
import { Link, Switch, Route } from 'react-router-dom'
import MarkerClusterer from "@google/markerclusterer"

import './App.css';


import LandingPage from './components/pages/LandingPage/LandingPage.js';
import Blog from './components/pages/Blog/Blog.js';
import WriteArticle from './components/pages/WriteArticle/WriteArticle.js';
import MapContainer from './components/MapContainer/MapContainer.js';
import GoogleMap from './components/GoogleMap/GoogleMap.js';
import MapWrapper from './components/MapWrapper/MapWrapper';

const google = window.google;
//shouldcomponentupdate, return false
// janky map component with component did mount in it
let exampleData= [
  {
    "type": "Feature",
    "properties": {
          "name": "mural 1",
          "artist": "bob ross"
          },
    "geometry": {
      "type": "Point",
      "coordinates": [
          37.790523241426946,
        -122.42563247680664

      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
          "name": "mural 2",
          "artist": "keith Harring"
          },
    "geometry": {
      "type": "Point",
      "coordinates": [
          37.78563944612241,
        -122.40211486816406
        
      ]
    }
  },
  {
    "type": "Feature",
    "properties": {
          "name": "sculpture 1",
          "artist": "doug jones"
          },
    "geometry": {
      "type": "Point",
      "coordinates": [
          37.783468766829,
        -122.44091033935547
        
      ]
    }
  }
]


class App extends Component {
  constructor() {
    super();
    this.state = {
      map: null,
      zoom: 13,
      maptype: 'roadmap',
      data: exampleData,
      userMarkerCoord: null,
      markers: [],
      activeMarker: null,
      activeID: "52",
      infoWindowOpen: false,
      activeInfoWindow: null,
      inputTitle: "",
      inputArtist: "",
      inputLocation: "",
      inputMedium: "",
      inputSize: "",
      inputYear:"",
    }
  }

  componentDidMount() {
      this._isMounted = true;
      this.fetchArtListing() 
     let map = new window.google.maps.Map(document.getElementById('map'), {
       center: { lat: 37.773972, lng: -122.431297 },
       zoom: 13,
       mapTypeId: 'roadmap',
     });

     this.setState({
       map: map,
     })

     let userMarker = new window.google.maps.Marker({
       map: map,
       position: { lat: 37.773972, lng: -122.431297 },
       icon: {
         url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
         scaledSize: new google.maps.Size(45, 45),
       }
     });

     google.maps.event.addListener(userMarker, 'click', (e) => {
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

     map.addListener('click', (e) => {
       this.placeMarker(e.latLng, map, userMarker);
     });
     this.fetchArtListing(map);

   }


   componentWillUnmount() {
     this._isMounted = false;
   }


   placeMarker(latLng, map, userMarker) {
     this.setState({
       userMarkerCoord: latLng,
     });
     console.log(this.state.userMarkerCoord.lat())
     userMarker.setPosition(this.state.userMarkerCoord)
   }


   displayInfoWindow(map, marker, infowindow, e) {
     if (this.state.activeInfoWindow) {
       this.state.activeInfoWindow.close()
     }

     infowindow.open(map, this.state.activeMarker);
     this.setState({
       infoWindowOpen: true,
       activeInfoWindow: infowindow,
     });

     infowindow.addListener('closeclick', (e) => {
       infowindow.close();
       this.setState({
         infoWindowOpen: false,
         activeInfoWindow: null,
       });
     });
   }

  fetchArtListing() {
    console.log('Fetching data from Mongo');
    fetch('/api/mongodb/ArtCollectionServer/')
      .then(response => response.json())
      .then(data => {
        console.log('Got data back', data);
        this.setState({
          data: data,
        });
        console.log("art collection from mongo", this.state.data)

    if (this.state.map !== null){
      let newMarkerArray =[]
      for (let item of this.state.data) {
        //console.log("item is:", item);
        let coords = item.geometry.coordinates
        let latLng = new google.maps.LatLng(coords[0],coords[1]);
        //console.log("map for marker is:", this.state.map)
        //console.log("latlng for marker is:", latLng)
        let marker = new google.maps.Marker({
          map: this.state.mapmap,
          position: latLng,
        });
        //console.log("new marker:", marker)
        let infowindow = new google.maps.InfoWindow({
          content: item.properties.title + ",\n  " + item.properties.artist
        });
        google.maps.event.addListener(marker, 'click', (e)=> {
          this.setState({
            activeMarker: marker,
            activeID: item.properties.id
          });
          this.displayInfoWindow(this.state.map, marker, infowindow, e)
        });
        if ( this.state.activeID === item.properties.id){ 
        console.log("it's a match")
                  this.setState({
                activeMarker: marker,
          });
          }
        newMarkerArray=newMarkerArray.concat(marker)

      }
      this.setState({
        markers: newMarkerArray
      },
      () => this.createMarkerCluster(this.state.markers),
      );
    

    } else {
      console.log("map didn't pass")
    }
  
      
      });
  };

  createMarkerCluster(markers){
    console.log("this.state.markers:", this.state.markers)
    console.log("get map", this.state.map)
    let zoom = parseInt(this.state.map.zoom.value, 10);
    let size = parseInt(this.state.map.value, 10);
    zoom = zoom == -1 ? null : zoom;
    size = size == -1 ? null : size;
    let markerCluster = new MarkerClusterer(this.state.map, this.state.markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        maxZoom: 19,
        gridSize: size,
      });
  }

  onChangeTitle = (ev) => {
    this.setState({
      inputTitle: ev.target.value,
    });
  }
  
    onChangeArtist = (ev) => {
    this.setState({
      inputArtist: ev.target.value,
    });
  }
  
    onChangeMedium = (ev) => {
    this.setState({
      inputMedium: ev.target.value,
    });
  }
  
    onChangeLocation = (ev) => {
    this.setState({
      inputLocation: ev.target.value,
    });
  }
  
    onChangeYear = (ev) => {
    this.setState({
      inputYear: ev.target.value,
    });
  }
  
    onChangeSize = (ev) => {
    this.setState({
      inputSize: ev.target.value,
    });
  }
  
    feature = (ev) => {
      console.log("this is ev target latlng:", ev.target.getAttribute('latLng'));
      let latLngAttribute= ev.target.getAttribute('latLng')
      let latLngArray= latLngAttribute.split(",")
      console.log("this is latlngarray:", latLngArray[0]);
      let latLng = new google.maps.LatLng(latLngArray[0],latLngArray[1]);
    this.setState({
     activeID: ev.target.id,
    });
    this.state.map.panTo( latLng);
    this.state.map.setZoom(18);
  }
  
    submit = () => {
    const formData = {
              "type": "Feature",
              "properties": {
                    "id": Math.random() * (100000 - 1) + 1,
                    "title": this.state.inputTitle,
                    "artist": this.state.inputArtist,
                    "date": this.state.inputYear,
                    "medium": this.state.inputMedium,
                    "size": this.state.inputSize,
                    "location": this.state.inputLocation,
                    "updated": "added"
                    },
              "geometry": {
                "type": "Point",
                "coordinates": [
                   this.state.userMarkerCoord.lat(),
                   this.state.userMarkerCoord.lng()

                ]
              }
            }
            
console.log("form data is:", formData)
    fetch('/api/mongodb/ArtCollectionServer/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Got this back', data);
      });
      this.fetchArtListing();
  }

  render() {
    return (
      <div className="App">
        <nav className="App-navigation">
          <h1 className="App-title">Public.Art</h1>
          <br/>
          

        </nav>
        <p className="App-tag"> Your guide to San Fracisco's Public Art </p>
        <div className="App-mainContent">

        <div className="Map" id='map' />
        <div className="List">
        <div className="List-child List-input">
        <h4> Add a Piece of Artwork </h4>
        Click the map to the left to set location and fill out as much information as you have
        <br/>
        <br/>
                  {this.state.userMarkerCoord !== null && (
          <p>Coordinates: {this.state.userMarkerCoord.lat()},  {this.state.userMarkerCoord.lng()}</p>
          )}<br/>
                Title: <input
            name="title"
            placeholder="Within The Winds"
            value={this.state.inputTitle}
            onChange={this.onChangeTitle}
          /><br/>
                Artist: <input
            name="artist"
            placeholder="Barney Hallo"
            value={this.state.inputArtist}
            onChange={this.onChangeArtist}
          />

          <br/>
        Location: <input
            name="location"
            placeholder="4th and King, Caltrain Station interior"
            value={this.state.inputLocation}
            onChange={this.onChangeLocation}
          /><br/>
        Medium: <input
            name="medium"
            placeholder="Bronze"
            value={this.state.inputMedium}
            onChange={this.onChangeMedium}
          /><br/>
        Size: <input
            name="size"
            placeholder="7ft tall"
            value={this.state.inputSize}
            onChange={this.onChangeSize}
          /><br/>
        Year: <input
            name="year"
            placeholder="1994"
            value={this.state.inputYear}
            onChange={this.onChangeYear}
          /><br/>
          <button onClick={this.submit}>Submit</button>
        </div>
        <div className= "List-child List-entries">
        {
          this.state.data.map((entry) => (
        <div className= {(this.state.activeID === entry.properties.id)? "List-entry  List-entry-active": "List-entry"} onClick={this.feature} id={entry.properties.id} latLng={entry.geometry.coordinates}>
               <h4>{entry.properties.title}</h4>
               Artist: {entry.properties.artist} <br/>
        Location: {entry.properties.location}<br/>
        Medium: {entry.properties.medium}<br/>
        Size: {entry.properties.size}<br/>
        Year: {entry.properties.date}
        </div>
          ))
        }

        </div>
        </div>

        </div>
      </div>
    );
  }
}

export default App;
