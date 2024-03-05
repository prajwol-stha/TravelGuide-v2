import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import fetchUserContribution from './fetchUserContribution';
import { ScrollView } from 'react-native-virtualized-view';
import FinalDetailsScreen from '../../../components/DetectionDetail';


const UserContributions = () => {
  const [contribDetails, setContribDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await fetchUserContribution();
        setContribDetails(details);
      } catch (error) {
        console.error('Error fetching user contributions:', error);
      }
    };

    fetchData();
  }, []);

  const navigateToDetails = (item) => {
    const { location } = item;
const [latitude, longitude] = location.split(',').map(coord => coord.trim());

console.log(latitude,longitude);


    navigation.navigate('DetectionDetail', {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      ...item,
    });
    console.log('Pressed', item);
  };

  return (
    <ScrollView>
      {contribDetails && contribDetails.documents && (
        <View>
          {contribDetails.documents.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              onPress={() => navigateToDetails(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default UserContributions;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
