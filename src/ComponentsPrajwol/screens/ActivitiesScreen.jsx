import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import activities from '../../constants/activities';
import COLORS from '../../constants/colors';
import ActivitiesDetails from './ActivitiesDetails';

const Card = ({ activity }) => {
  const navigation = useNavigation();

  const handlePress = () => {

    // navigation.navigate('ActivitiesDetails', { activity });
    navigation.navigate('MainStack', { screen: 'ActivitiesDetails', params:{activity} })
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.cardContainer}>
        <Image source={activity.image} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{activity.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const App = () => {
  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Card activity={item} />}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardTitle: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    backgroundColor: COLORS.white,
    color: 'black',
  },
});

export default App;
