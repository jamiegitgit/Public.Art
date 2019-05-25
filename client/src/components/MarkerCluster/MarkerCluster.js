import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import MarkerClusterer from '@google/markerclusterer'

const evtNames = [
  'click',
  'dblclick',
  'dragend',
  'mousedown',
  'mouseout',
  'mouseover',
  'mouseup',
  'recenter',
]

const markerCluster = (props) => {
  const {map, google, markers} = props
  
  const handleEvent = ({event, marker, entry}) => {
    if (props[event]) {
      props[event]({
        props: props,
        marker: marker,
        event: event,
        entry: entry
      })
    }
  }
  
  // This hook works like ComponentWillMount
  // The  hook isn't really needed, this whole thing worked without it,
  // I added the hook so that I could implement a cleanup function

      
      const clusterer = new MarkerClusterer(map, markers, {imagePath: '/static/images/maps/m'})
      
      // Cleanup function. Note, this is only returned if we create the markers
      return () => {
        //console.log('Cleaning up markers')
        clusterer.clearMarkers()
      }
    }
  


markerCluster.propTypes = {
  map: PropTypes.object,
  google: PropTypes.object,
  markers: PropTypes.arrayOf(PropTypes.shape({
    position: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
  })),
}

export default markerCluster
