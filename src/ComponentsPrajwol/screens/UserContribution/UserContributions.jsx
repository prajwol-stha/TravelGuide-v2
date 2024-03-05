import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';


const UserContributions = () => {
  const [contribDetails, setContribDetails] = useState(null);
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  function toggleRefresh() {
    setRefresh(v => !v)
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        setRefreshing(true);
        const details = await fetch("https://travelguide.khanalsaurav.com.np/api/v1/contribution/all");
        const result = await details.json();
        // console.log(JSON.stringify(result.data, null, 2)); 
        setContribDetails(result.data.reverse());
        setRefreshing(false);
      } catch (error) {
        console.error('Error fetching user contributions:', error);
        setRefreshing(false);
      }
    };

    fetchData();
  }, [refresh]);

  const navigateToDetails = (item) => {
    const { location } = item;
    const [latitude, longitude] = location.split(',').map(coord => coord.trim());

    navigation.navigate('DetailsScreen', {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      ...item,
      className: item.name // to show on map
    });

  };

  function DetailCard({ item }) {
    return (
      <Pressable
        key={item._id}
        style={styles.card}
        onPress={() => navigateToDetails(item)}
        android_ripple={{
					foreground: true,
					radius: 500,
					color: "rgba(0,0,0,0.3)",
					borderless: false,
				}}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        {/* {console.log(JSON.stringify(item, null, 2))} */}
      </Pressable>
    )
  }


  function ListEmpty() {
    return (
      <Text style={styles.text}>No contributions are available. {'\n'} Pull Down to refresh</Text>
    )
  }

  function ListFooter() {
    return (
      <View style={{height: 30}}></View>
    )
  }

  return (
    <FlatList
      data={contribDetails}
      renderItem={DetailCard}
      keyExtractor={item => item._id}
      initialNumToRender={3}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={ListEmpty}
      onRefresh={toggleRefresh}
      refreshing={refreshing}
      refreshControl={<RefreshControl onRefresh={toggleRefresh} refreshing={refreshing}/>}
      style={styles.flatList}
      contentContainerStyle={styles.flatListItem}
    />
  );
};

export default UserContributions;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    // margin: "5%",
    // padding: 10,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    // width: "40%"
    marginBottom: 15
  },
  image: {
    width: '100%',
    height: 200,
    // borderRadius: 8,
    // marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    margin: 10

  },
  text: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
    paddingVertical: 20
  },
  flatList: {
    marginHorizontal: 15,
    paddingVertical: 20,
    paddingBottom: 50
  },
  flatListItem: {

  }
});