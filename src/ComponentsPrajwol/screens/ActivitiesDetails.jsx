import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import { ScrollView } from 'react-native-virtualized-view';

const ActivitiesDetails = () => {
  const route = useRoute();
  const { activity } = route.params;

  const handleOpenMap = () => {
    const { coordinates, name } = activity;
    const { latitude, longitude } = coordinates.latlng;
    const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}&label=${name}`;
    Linking.openURL(mapUrl).catch((err) => console.error('Error opening map:', err));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Image source={activity.image} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{activity.name}</Text>
          <Text style={styles.details}>{activity.details}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleOpenMap}>
        <Text style={styles.buttonText}>Open In Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  details: {
    fontSize: 18,
    color: 'black',
    textAlign: 'justify', 
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    marginHorizontal: '10%',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ActivitiesDetails;
