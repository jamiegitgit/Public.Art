import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react';
import MarkerCluster from '../MarkerCluster/MarkerCluster.js'




//      {
//        this.props.data.map((category, index) => (
//          <Marker
//             key= {index}
//             label={this.state.highlightedMarker === index ?
//                'X' : 'O'
//             }
//             name=<div><h4>{category.properties.title}</h4> 
//             <h5> artist: {category.properties.artist} </h5>
//             <h5> date: {category.properties.date} </h5>
//             <h5> medium: {category.properties.medium} </h5>
//             <h5> size: {category.properties.size} </h5>
//             <h5> location: {category.properties.location} </h5>
//             <h5> address: {category.properties.address} </h5></div>
//             position={{ lat: category.geometry.coordinates[0], 
//             lng: category.geometry.coordinates[1] }} 
//            onClick={this.onMarkerClick} />
//                        ))
//        }
//        
//                {this.state.showingUserMarker && (
//            <Marker
//            ref={"usermarker"}
//            title="userMarker"
//             name=<div><h4>input art name: </h4>
//             <h5>input artist name:</h5></div>
//             position={{ lat: this.state.userMarkerLat, 
//             lng: this.state.userMarkerLng}} 
//            onClick={this.onMarkerClick} />

//            )}
//        <InfoWindow
//          marker={this.state.activeMarker}
//          visible={this.state.showingInfoWindow}
//            onOpen={this.windowHasOpened}
//            onClose={this.windowHasClosed}>
//            <div>
//              <h1>{this.state.selectedPlace.name}</h1>
//            </div>
//        </InfoWindow>




export class MapContainer extends Component {
   state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    highlightedMarker: null,
    showingUserMarker: false,
    userMarkerLat: null,
    userMarkerLng: null,
    markers: this.props.data,
  };
  


  onMarkerClick = (props, marker, e) =>{
   console.log("marker argument is:", marker)
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
    }


  onMapClicked = (t, map, coord) => {

    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
      }
      this.setState({
        showingUserMarker: true,
        userMarkerLat: coord.latLng.lat(),
        userMarkerLng: coord.latLng.lng(),
        
      });
        console.log("coords:", coord)
  };
  
  buttonClicked = (titleOfThing) => {
    this.setState({
      highlightedMarker: titleOfThing,
    });
  }
  

 
  render() {
    const style = {
  width: '800px',
  height: '600px'
}
    return (
    <div>
      <Map style={style} google={this.props.google} zoom={13} initialCenter={{lat: 37.773972, lng: -122.431297}} onClick={this.onMapClicked}        onReady={this.fetchData}>
{console.log("our data looks like:", this.props.data)}













      </Map>
          <div style={{top:0, right:0, position:'fixed'}}>
            <button onClick={() => this.buttonClicked(1)}>click me!!! 1</button>
            <button onClick={() => this.buttonClicked(2)}>click me!!! 2</button>
          </div>
      </div>
        );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDN5mCz2_1PMlG3Z7eZZ8NPp9I6rgEzKMQ")
})(MapContainer)
