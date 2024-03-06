import React, { useState, useEffect } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
	Text,
	ImageBackground,
	FlatList,
	Dimensions,
	TouchableOpacity,
	Image,
	Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../constants/colors';
import cuisines from '../../constants/cusines';
import openMap from 'react-native-open-maps';
import fetchWH from '../../ComponentsPrajwol/screens/WorldHeritage/fetchWH';
import Iconx from 'react-native-vector-icons/MaterialCommunityIcons'

const { width } = Dimensions.get('screen');

const categoryIcons = [
	<Icon name="restaurant" size={25} color={COLORS.dark} />,
	<Iconx name="hospital" size={25} color={COLORS.dark} />,
	<Icon name="wc" size={25} color={COLORS.dark} />,
	<Icon name="atm" size={25} color={COLORS.dark} />,
];

const HomeScreen = ({ navigation }) => {

	const handleCategoryPress = (iconName) => {
		// console.log(`Pressed category ${iconName}`);
		openMap({ query: iconName == "wc" ? "Toilet" : iconName, provider: 'google' });
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


	const RecommendedCard = ({ place }) => {
		return (
			<TouchableOpacity activeOpacity={0.8}
				onPress={() => navigation.navigate('DetailsScreen', {...place})}>

				<ImageBackground style={style.rmCardImage} source={place.image}>
					<Text
						style={{
							color: COLORS.white,
							fontSize: 22,
							fontWeight: 'bold',
							backgroundColor: "rgba(0,0,0,0.3)",
							textAlign: 'center',
							position:'absolute',
							padding: 5,
							// left:0,
							borderBottomRightRadius: 8
						}}>
						{place.className}
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
	const [worldHeritageDetails, setWorldHeritageDetails] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const worldHeritageResponse = await fetchWH();
				setWorldHeritageDetails(worldHeritageResponse);
			} catch (error) {
				console.error('Error fetching user contributions:', error);
			}
		};

		fetchData();
	}, []);


	const navigateToWorldHeritageDetails = (item) => {
		navigation.navigate('DetailsScreen', { ...item });
	};


	const renderCard = ({ item }) => (
		<TouchableOpacity
			key={item.id}
			style={styles.cardWh}
			onPress={() => navigateToWorldHeritageDetails(item)}
			activeOpacity={0.8}
		>
			<Image source={{ uri: item.imageLink }} style={styles.imagewh} />
			<Text style={styles.nameWh}>{item.className}</Text>
		</TouchableOpacity>
	);




	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
			<StatusBar translucent={false} backgroundColor={COLORS.primary} />

			<ScrollView showsVerticalScrollIndicator={false}>
				<View
					style={{
						backgroundColor: COLORS.primary,
						height: 120,
						paddingHorizontal: 20,
					}}>
					<View style={{ flex: 1 }}>
						<Text style={style.headerTitle}>Discover the Best</Text>
						<Text style={style.headerTitle}>Sites to Travel</Text>

						<View style={style.inputContainer}>
							<Pressable
								onPress={() => navigation.navigate("SearchScreen")}
								android_ripple={{
									radius: 350,
									color: "rgba(0,0,0,0.3)",
								}}
								style={style.inputContainerInside}
							>
								<Icon name="search" size={28} color={COLORS.darkGrey} />
								<Text style={{ color: "grey" }}>Search Heritage Sites</Text>
							</Pressable>
						</View>
					</View>
				</View>

				<ListCategories />

				<Text style={style.sectionTitle}>Places</Text>

				<View style={styles.containerWh}>
					{worldHeritageDetails?.documents && (
						<FlatList
							data={worldHeritageDetails.documents}
							keyExtractor={(item) => item.classNumber}
							renderItem={renderCard}
							horizontal
							showsHorizontalScrollIndicator={false}
						/>
					)}
				</View>


				<Text style={style.sectionTitle}>Cuisines</Text>
				<FlatList
					snapToInterval={width - 20}
					contentContainerStyle={{ paddingLeft: 20 }}
					horizontal
					showsHorizontalScrollIndicator={false}
					data={cuisines}
					renderItem={({ item }) => <RecommendedCard place={item} />}
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
		borderRadius: 8,
		position: 'absolute',
		top: 90,
		elevation: 16,
		overflow: 'hidden'
	},
	inputContainerInside: {
		backgroundColor: COLORS.white,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		width: "100%",
		height: "100%",
	},
	categoryContainer: {
		marginTop: 50,
		marginHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		
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
		
	},
	sendBackward: {
		

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
	},
	imagewh: {
		width: '100%',
		height: '100%',
		borderRadius: 8,
		resizeMode: 'cover',
	},
	nameWh: {
		position: 'absolute',
		bottom: 0,
		paddingBottom:5,
		bottom: 0,
		paddingBottom:5,
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		width: '100%',
		backgroundColor: "rgba(0,0,0,0.2)",
	},
});

export default HomeScreen;