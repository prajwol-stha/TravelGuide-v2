import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';

const DetailsScreenCuisine = ({navigation, route}) => {
  const place = route.params;
  return (
    
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      
      {/* <StatusBar translucent backgroundColor="rgba(0,0,0,0)" /> */}
      
      <ImageBackground style={{flex: 0.8}} source={place.image}>
        <View style={style.header}>
          <Icon
            name="arrow-back-ios"
            size={28}
            color={COLORS.white}
            onPress={navigation.goBack}
          />
        </View>
        <View style={style.imageDetails}>
          <Text
            style={{
              width: '70%',
              fontSize: 30,
              fontWeight: 'bold',
              color: COLORS.white,
              marginBottom: 0,
            }}>
              
            {/* {place.name} */}
          </Text>
          {/* <View style={{flexDirection: 'row'}}>
            <Icon name="star" size={30} color={COLORS.orange} />
            <Text
              style={{color: COLORS.white, fontWeight: 'bold', fontSize: 20}}>
              5.0
            </Text>
          </View> */}
        </View>
      </ImageBackground>
      <ScrollView style={style.detailsContainer}>
        <View style={style.detailsContainer}>
          {/* <View style={style.iconContainer}>
            <Icon name="favorite" color={COLORS.red} size={30} />
          </View> */}
          <View style={{flexDirection: 'row', marginTop: 10}}>
		  {/* {place.location && <Icon name="place" size={28} color={COLORS.primary} />} */}
           {place.location && <Text
              style={{
                marginLeft: 5,
                fontSize: 20,
                fontWeight: 'bold',
                color: COLORS.primary,
              }}>
              {place.name}
            </Text>}
		  {place.foodName && <Icon name="fastfood" size={28} color={COLORS.primary} />}
           {place.foodName && <Text
              style={{
                marginLeft: 5,
                fontSize: 20,
                fontWeight: 'bold',
                color: COLORS.primary,
              }}>
              {place.foodName}
            </Text>}
           {/* {place.price && <Text
              style={{
                marginLeft: -90,
                fontSize: 20,
                fontWeight: 'bold',
                color: COLORS.primary,
              }}>
              {'\n'}
              Price: {place.price}
            </Text>} */}
          </View>
          {/* <Text style={{marginTop: 20, fontWeight: 'bold', fontSize: 20,color: COLORS.dark}}>
            About the heritage
          </Text> */}
          <Text style={{marginTop: 20, lineHeight: 22, color:COLORS.dark}}>{place.details}</Text>
        </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({

 
  detailsContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    flex: 0.3,
    },
  header: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  imageDetails: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 30,
  },
});

export default DetailsScreenCuisine;