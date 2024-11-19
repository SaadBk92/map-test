import React, { useState } from 'react';
import { View, Button, StyleSheet, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import dummy from './dummy';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const GOOGLE_MAPS_APIKEY = 'GOOGLE_MAPS_APIKEYU'; 


const HomeScreen = () => {
  const markers = dummy.dummy_DATA;
  const [selectedRange, setSelectedRange] = useState([]); // Default to the first 10 markers
  const origin =    { "latitude": 47.1486932, "longitude": -122.3886314 }
  const [showConnections, setShowConnections] = useState(false); // State to control connections visibility

  const handleRangeSelect = (start, end) => {
    setShowConnections(true)
    setSelectedRange([start, end]);
  };

  const displayedMarkers = markers.slice(selectedRange[0], selectedRange[1]);
  const rangeSize = 10; // Size of each range
  const ranges = [];
  for (let i = 0; i < markers.length; i += rangeSize) {
    ranges.push([i, Math.min(i + rangeSize, markers.length)]);
  }

  const resetSelection = () => {
    setSelectedRange([]); 
    setShowConnections(false)
  };
console.log('ss',selectedRange);

  return (
    <View style={styles.container}>
    

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {/* User Marker */}
        <Marker
          coordinate={{ latitude: origin.latitude, longitude: origin.longitude }}
          title="User  Location"
          pinColor="blue" // User marker color
        />

        {/* Location Markers */}
        {displayedMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={`Marker ${index + selectedRange[0] + 1}`}
            pinColor="red" // Location marker color
          />
        ))}

        {/* Show Directions from User to the first marker in the selected range */}
        { showConnections && (
          <MapViewDirections
            origin={origin}
            destination={displayedMarkers[0]} // Connect to the first marker in the selected range
            waypoints={displayedMarkers.slice(1).map(marker => ({
              latitude: marker.latitude,
              longitude: marker.longitude,
            }))}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
            }}
            onError={errorMessage => {
              console.error(errorMessage);
            }}
          />
        )}
      </MapView>
      <ScrollView horizontal style={styles.tabContainer}>
        {ranges.map((range, index) => (
          <Button
            key={index}
            title={`${range[0] + 1} to ${range[1]}`}
            onPress={() => handleRangeSelect(range[0], range[1])}
          />
        ))}
        <Button title="Reset" onPress={resetSelection} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  tabContainer: {
    flexDirection: 'row',
    // padding: 10,
    marginHorizontal:20,
    backgroundColor: 'white',
    position:'absolute',
    bottom:0,
    alignSelf:'center'
  },
});

export default HomeScreen;