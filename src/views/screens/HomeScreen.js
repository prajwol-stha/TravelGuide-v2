import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../constants/colors';
import places from '../../constants/places';
import cuisines from '../../constants/cusines';

import openMap from 'react-native-open-maps';
import fetchDetailsFromDb from '../../componentsSaurav/apiCalls/fetchDataFromDB';

import activities from '../../constants/activities';
import fetchWH from '../../ComponentsPrajwol/screens/WorldHeritage/fetchWH';
// import DetailsScreen from '../../ComponentsPrajwol/screens/UserContribution/DetailsScreen';
import DetailsScreen from '../../components/DetailsScreen'
import FinalDetailsScreen from '../../components/DetectionDetail';
import SemiFinalDetailsScreen from '../../components/DetailsScreen';
import DetailsScreenCuisine from './DetailsScreenCuisine';
import Iconx from 'react-native-vector-icons/MaterialCommunityIcons'
const data = [
  { id: '0', title: 'Akash Bhairab Temple' },
  { id: '1', title: 'Bhagwati Temple' },
  // { id: '2', title: 'Bhuvaneshwor Mahadev Temple' },
  { id: '2', title: 'Chasin Dega Temple' },
  { id: '3', title: 'Degu Talle Temple' },
  { id: '4', title: 'Dhansa Temple' },
  { id: '5', title: 'Gaddi Baithak' },
  { id: '6', title: 'Gopinath Temple' },
  { id: '7', title: 'Gorakhnath Shrine' },
  { id: '8', title: 'Hanuman Temple' },
  { id: '9', title: 'Jagannath Temple' },
  { id: '10', title: 'Kageshwor Mahadev Temple' },
  { id: '11', title: 'Kasthamandap' },
  { id: '12', title: 'Kotilingeshwar Mahadev Temple' },
  { id: '13', title: 'Kumari Ghar' },
  { id: '14', title: 'Lalitpur Bhawan' },
  { id: '15', title: 'Mahadev temple' },
  { id: '16', title: 'Mahadev Chaitya' },
  { id: '17', title: 'Mahendreshwor Mahadev Temple' },
  { id: '18', title: 'Maju Dega' },
  { id: '19', title: 'Nau Talle Durbar' },
  { id: '20', title: 'Newroad Juddha Salik' },
  { id: '21', title: 'Shivalinga Temple' },
  { id: '22', title: 'Shree Kal Bhairab' },
  { id: '23', title: 'Shree Mahalaxmi Temple' },
  { id: '24', title: 'Silyan Sata House' },
  { id: '25', title: 'Statue At Entrance' },
  { id: '26', title: 'Swet Bhairab' },
  { id: '27', title: 'Taga Gan Bell' },
  { id: '28', title: 'Taleju Bhawani Temple' },
  { id: '29', title: 'Trrailokya Mohan Narayan Temple' },
];



const {width} = Dimensions.get('screen');

const HomeScreen = ({navigation}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const searchFilterFunction = (text) => {
    setSearchQuery(text);
    setFilteredData(
      text
        ? data.filter((item) =>
            item.title.toLowerCase().includes(text.toLowerCase())
          )
        : []
    );
  };

  const renderFilteredData = () => {
    if (searchQuery !== '') {
      return (
        <View style={styles.overlayContainer}>
          {filteredData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => handleListItemPress(item)}
            >
              <Text style={styles.listItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return null;
    }
  };
  const [classNumber,setclassNumber]=useState('');
  
  const [datam, setDatam] = useState(null);
  useEffect(() => {

		const fetchData = async () => {
      
			try {
        
				const result = await fetchDetailsFromDb(classNumber);
				// setRenderSkeleton(false)
				// console.log(result)
				setDatam(result)

			} catch (error) {
				console.error('fetching from db failed', error);
				//code to handle error in app , display some alert sth else
			}
		}

		fetchData(classNumber);

		return (
			() => {
				console.log('clear use effect');
				setDatam(null);
				// setRenderSkeleton(true)
			}
		)

	}, [classNumber])

  const handleListItemPress = async (item) => {
    console.log(`Pressed: ${item.title}`);
    console.log(`Pressed id: ${item.id}`);
    async function fetchData(){
      const response=await fetchDetailsFromDb(parseInt(item.id))
      console.log(response)
      navigation.navigate('DetectionDetail',{...response})
    }
    await fetchData();
  };


  const categoryIcons = [
    <Icon name="restaurant" size={25} color={COLORS.dark}/>, 
    <Iconx name="hospital" size={25} color={COLORS.dark} />,
    <Icon name="wc" size={25} color={COLORS.dark} />,
    <Icon name="atm" size={25} color={COLORS.dark} />,
  ];

  const handleCategoryPress = (iconName) => {
    console.log(`Pressed category ${iconName}`);
    openMap({ query: iconName, provider: 'google' });
  };
  const ListCategories = () => {
    return (
      <View style={style.categoryContainer}>
        {categoryIcons.map((icon, index) => (
          <TouchableOpacity key={index} style={style.iconContainer} onPress={() => handleCategoryPress(icon.props.name)}>
            {icon}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const Card = ({place}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('DetailsScreen',place)}>
        <ImageBackground style={style.cardImage} source={place.image}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 10,
            }}>
            {place.name}
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="place" size={20} color={COLORS.white} />
              <Text style={{marginLeft: 5, color: COLORS.white}}>
                {place.location}
              </Text>
            </View>
            
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const RecommendedCard = ({place}) => {
    return (
      <TouchableOpacity activeOpacity={0.8}
      onPress={() => navigation.navigate('DetailsScreenCuisine',place)}>

      <ImageBackground style={style.rmCardImage} source={place.image}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 22,
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          {place.name}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
        </View>
      </ImageBackground>
    </TouchableOpacity>
    );
  };
//world heritage
  const [worldheritageDetails, setWorldheritageDetails] = useState(null);
  const navigationn = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const worldheritageResponse = await fetchWH();
        setWorldheritageDetails(worldheritageResponse);
      } catch (error) {
        console.error('Error fetching user contributions:', error);
      }
    };

    fetchData();
  }, []);

  const navigateToWorldHeritageDetails = (item) => {
    navigationn.navigate('SemiFinalDetailsScreen',{...item});
    // console.log(typeof(item))
    // navigationn.navigate('DetailsScreen',{...item});
    // navigationn.navigate('DetailsScreen', { worldheritageResponse: item });
    // navigationn.navigate('FinalDetailsScreen',{...item});

    // console.log('Pressed in homescreen',item);
    // console.log(`Coordinate is ${item.latitude},${item.longitude}`);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.cardWh}
      onPress={() => navigateToWorldHeritageDetails(item)}
    >
      <Image source={{ uri: item.imageLink }} style={styles.imagewh} />
      <Text style={styles.nameWh}>{item.className}</Text>
    </TouchableOpacity>
  );

  const {t,i18n}=useTranslation();
    function handlePress(code){
        if (i18n.language !== code) {
            i18n.changeLanguage(code);
        }
        console.log(code);
    }



  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar translucent={false} backgroundColor={COLORS.primary} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            height: 120,
            paddingHorizontal: 20,
          }}>
          <View style={{flex: 1}}>
            <Text style={style.headerTitle}>{t('Discover')} the Best</Text>
            <Text style={style.headerTitle}>Sites to Travel</Text>
            <View style={style.inputContainer}>

            <Icon name="search" size={28} color={COLORS.darkGrey}/>
                  <TextInput
                    placeholder="Search"
                    onChangeText={searchFilterFunction}
                    value={searchQuery}
                    placeholderTextColor={COLORS.placeholder}
                  />
                  {renderFilteredData()}
                  
                </View>
          </View>
        </View>
        <ListCategories />
        <Text style={style.sectionTitle}>Places</Text>
        <View style={styles.containerWh}>
      {worldheritageDetails && worldheritageDetails.documents && (
        <FlatList
          data={worldheritageDetails.documents}
          keyExtractor={(item) => item.classNumber}
          renderItem={renderCard}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
        {/* <View style={style.sendBackward}> */}

          {/* <FlatList
            contentContainerStyle={{paddingLeft: 20}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={places}
            renderItem={({item}) => <Card place={item} />}
          /> */}

          <Text style={style.sectionTitle}>Cuisines</Text>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{paddingLeft: 20}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={cuisines}
            renderItem={({item}) => <RecommendedCard place={item} />}
          />
          {/* <Text style={style.sectionTitle}>Activities</Text>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{paddingLeft: 20, paddingBottom: 20}}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={activities}
            renderItem={({item}) => <RecommendedCard place={item} />}
          /> */}
        
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 23,
  },
  inputContainer: {
    height: 50,
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    position: 'absolute',
    top: 90,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 16,
  },
  categoryContainer: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex:-1,
  },
  iconContainer: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginVertical: 10,
    fontWeight: 'bold',
    fontSize: 20,

    color: COLORS.darkGrey,
    zIndex:-1,
  },
  sendBackward:{
    zIndex:-1,

  },
  cardImage: {
    height: 220,
    width: width / 2,
    marginRight: 20,
    padding: 10,
    overflow: 'hidden',
    borderRadius: 10,
  },
  rmCardImage: {
    width: width - 40,
    height: 200,
    marginRight: 20,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    top: 60, 
    right: '5%', 
    left: '5%', 
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  text: {
    fontSize: 20,
    color: '#000',
    marginTop: 60,
    fontWeight: '700',
  },
  listItem: {
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  listItemText: {
    fontSize: 18,
    color: COLORS.dark,
  },
  searchBar: {
    marginTop: 20,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  containerWh: {
    flexDirection: 'row',
    zIndex:-1,
  },
  cardWh: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginLeft: 20,
    padding: 0,
    alignItems: 'center',
    overflow: 'hidden', 
    zIndex:-1,
  },
  imagewh: {
    width: '100%',
    height: '100%', 
    borderRadius: 8,
    resizeMode: 'cover',
  },
  nameWh: {
    position: 'absolute', 
    bottom: 10, 
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white', 
    width: '100%', 
  },
});

export default HomeScreen;