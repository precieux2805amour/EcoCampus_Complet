import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ route }) => {
  // Sécurisation des paramètres
  const latitude = route?.params?.latitude ?? 6.3702928;   // Cotonou par défaut
  const longitude = route?.params?.longitude ?? 2.3912362;

  // Point de départ (exemple : centre administratif)
  const origin = {
    latitude: 6.3702928,
    longitude: 2.3912362,
  };

  const destination = { latitude, longitude };

  // ⚠️ Recommandé : stocker la clé dans app.config.js ou .env
  const GOOGLE_MAPS_APIKEY = 'TA_CLE_API_GOOGLE_MAPS';

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={origin}
          title="Départ"
          pinColor="green"
        />

        <Marker
          coordinate={destination}
          title="Destination"
          pinColor="red"
        />

        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="#4CAF50"
          optimizeWaypoints
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
});

export default MapScreen;
