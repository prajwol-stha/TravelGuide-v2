// // DetailsScreen.js

// import React from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';

// const DetailsScreen = ({ route }) => {
//   const { details } = route.params;

//   return (
//     <View style={styles.container}>
//       <Image source={{ uri: details.imageurl }} style={styles.image} />
//       <Text style={styles.name}>{details.Name}</Text>
//       <Text style={styles.description}>{details.Description}</Text>
//       {/* Add more details as needed */}
//     </View>
//   );
// };

// export default DetailsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: 300,
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   description: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginHorizontal: 20,
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import COLORS from '../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import fetchDetailsFromDb from '../componentsSaurav/apiCalls/fetchDataFromDB';
import fetchKDS from './fetchKDS';

import ExpandableCard from '../componentsSaurav/customComponents/ExpandableCard';
import CustomHeader from '../componentsSaurav/customComponents/CustomHeader';
import ActionCard from '../componentsSaurav/customComponents/ActionCard';
import { getmyLocation } from '../ComponentsPrajwol/modules/getMyLocation';
import calculateDistanceDuration from '../ComponentsPrajwol/modules/calculateDistanceDuration';




const SemiFinalDetailsScreen = ({ navigation, route }) => {
	const { _id, className, architectureStyle, constructedBy, Ticket, Description, imageLink, constructionDate, latitude, longitude, Location, Year, imageUrl, name, description } = route.params;
	const [distance, setDistance] = useState(null);
	const [myLocation, setMyLocation] = useState({})
	const [distanceDuration, setDistanceDuration] = useState({})
	const [finalData, setFinalData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: 'Location Permission',
						message: 'Give location permission',
						buttonNeutral: 'Ask Me Later',
						buttonNegative: 'Cancel',
						buttonPositive: 'OK',
					},
				);

				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					// console.log('Location permission granted');

					Geolocation.getCurrentPosition(
						(position) => {
							const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
							const destination = { lat: latitude, lng: longitude };
							const apiKey = MAPS_API_KEY;

							// console.log("this is geolib");
							// const dist=getDistance(
							//     { lat: position.coords.latitude, lng: position.coords.longitude },
							//     { lat:latitude,lng:longitude }
							// )
							// console.log(dist/1000)

							const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`;

							fetch(url)
								.then((response) => response.json())
								.then((data) => {
									// console.log('Data from API:', data);
									const distanceText = data.rows[0].elements[0].distance.text;
									const durationText = data.rows[0].elements[0].duration.text;
									// console.log("******************")
									// console.log(distanceText);
									// console.log(durationText);

									setDistance({ distanceText, durationText });
								})
								.catch((error) => console.error('Error fetching distance matrix:', error));
						},
						(error) => {
							console.log('Error getting location', error.code, error.message);
						},
						{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
					);
				} else {
					console.log('Location permission denied');
				}
			} catch (err) {
				console.warn(err);
			}

		};

		fetchData();
	}, [latitude, longitude]);

	// console.log(latitude,longitude)

	async function fetchInsideHeritage() {
		// console.log('inside the unesco');
		// console.log('inside the unesco',_id);
		const insideKDS = await fetchKDS();
		// const insideKDS=await fetchDetailsFromDb(12);
		// console.log(insideKDS);
		// const insideKDSData = insideKDS.document.className;
		// const insideKDSData = insideKDS.documents[0].className;
		const insideKDSData = insideKDS.documents;
		// console.log(insideKDSData);
		setFinalData(insideKDSData.slice(0, 30));
		// console.log('-------------------------------------------')
		// console.log(finalData)
	}
	async function handleClassItemPress(item) {
		// console.log('You pressed',item.className)
		const info = await fetchDetailsFromDb(item.classNumber)
		// console.log(typeof(info))
		// console.log("Finally, aaaaaaaa",info.classNumber)
		// navigation.navigate('FinalDetailsScreen',{});
		navigation.navigate('DetectionDetail', { ...info });

	}
	//   const renderItem = ({ item }) => (
	//     <TouchableOpacity onPress={() => handleClassItemPress(item)}>
	//         <View style={styles.listItem}>
	//             <Text style={styles.listItemText}>{item.className}</Text>
	//         </View>
	//     </TouchableOpacity>
	// );
	const renderItem = ({ item }) => (
		<View style={styles.cardContainer}>
			<TouchableOpacity onPress={() => handleClassItemPress(item)}>
				<View style={styles.smallCard}>
					<Image source={{ uri: item.imageLink }} style={styles.cardImage} />
					<View style={styles.cardContent}>
						<Text style={styles.cardTitle}>{item.className}</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);


	useEffect(() => {
		async function updateMyLocation() {
			const { latitude, longitude } = await getmyLocation()
			setMyLocation({ latitude, longitude })
		}

		async function updateDistanceDuration() {
			const { distanceText, durationText } = await calculateDistanceDuration({ myLocation }, { latitude, longitude })
			// distanceDuration.distance = distanceText
			// distanceDuration.drivingDuration = durationText

			const { durationText: walkingDuration } = await calculateDistanceDuration({ myLocation }, { latitude, longitude }, "walking")
			// distanceDuration.walkingDuration = walkingDuration
			setDistanceDuration({ distance, drivingDuration: durationText, walkingDuration })
		}

		updateMyLocation();
		updateDistanceDuration();
	}, [])

	// async function addToBookmark() {
	// 	dispatch(addToPlan({}))
	// }

	return (
		<>
			<CustomHeader title={className} />
			<View style={styles.container}>
				{imageLink || imageUrl ? (
					<Image source={{ uri: imageLink || imageUrl }} style={styles.image} />

				) : null}

				<ActionCard>
					<TouchableOpacity style={styles.group}>
						<IconM name='map-marker-distance' color={COLORS.primary} size={30} style={styles.actionIcon} />
						<Text style={styles.actionText}>{distanceDuration?.distance || "Distance"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.group}>
						<Icon name='directions-bus' color={COLORS.primary} size={30} style={styles.actionIcon} />
						<Text style={styles.actionText}>{distanceDuration?.drivingDuration || "Drive"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.group}>
						<Icon name='directions-walk' color={COLORS.primary} size={30} style={styles.actionIcon} />
						<Text style={styles.actionText}>{distanceDuration?.walkingDuration || "Walk"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.group} onPress={() => navigation.navigate('Maps', { location: { latitude, longitude }, name: className })} >
						{latitude && longitude && <Icon name='map' color={COLORS.primary} size={30} style={styles.actionIcon} />}
						<Text style={styles.actionText}>View map</Text>
					</TouchableOpacity>
					{/* <TouchableOpacity style={styles.group} onP>
						<Icon name='bookmark' color={COLORS.primary} size={30} />
						<Text style={styles.actionText}>plan</Text>
					</TouchableOpacity> */}
				</ActionCard>

				{/* <View style={styles.headingView}>
					<Icon name="place" size={28} color={COLORS.primary} />

					{(name || className) && (
						<Text style={styles.headingText}> {name || className}</Text>
					)}

				</View> */}
				{/* <Pressable style={styles.backBtn}>
				<Icon
					name="arrow-back-ios"
					size={28}
					color={COLORS.white}
					onPress={navigation.goBack}
					/>
			</Pressable> */}
				<ScrollView style={styles.content}>
					{ (architectureStyle || constructedBy || constructionDate || Ticket) && <TouchableOpacity style={styles.topCard}>
						{architectureStyle && <Text style={styles.detailText}>Architecture Style: {architectureStyle}</Text>}
						{/* {constructedBy && <ExpandableCard title={"constructed By"} details={constructedBy} />} */}
						{constructedBy && <Text style={styles.detailText}>Constructed By: {constructedBy}</Text>}
						{constructionDate && <Text style={styles.detailText}>Constructed in: {constructionDate}</Text>}
						{Ticket && <Text style={styles.detailText}>Ticket Required: {Ticket}</Text>}
					</TouchableOpacity>}

					{/* <Text style={styles.detailText}>Distance : {distance?.distanceText} </Text> */}
					{/* <Text>Distance Value: {distance?.distanceValue}</Text> */}
					{/* <Text style={styles.detailText}>Duration : {distance?.durationText} </Text> */}
					{/* <Text>Duration Value: {distance?.durationValue}</Text> */}

					{/* {Description && <Text style={styles.detailText}>Description: {Description}</Text>} */}
					{(Description || description) && (<>
						{/* <Text style={styles.detailText}>Description: {Description || description}</Text> */}
						<ExpandableCard title={"Description"} details={Description || description} />
					</>
					)}

					{/* {latitude && longitude && <Text style={styles.detailText}>Location: {latitude},{longitude}</Text>} */}

					{/* {latitude && longitude && <Icon name='map' color={COLORS.primary} size={30} style={styles.icon} onPress={() => navigation.navigate('Maps', { location: { latitude, longitude }, name: className })} />} */}
					{className === "Kathmandu Durbar Square" ? (
					<TouchableOpacity onPress={fetchInsideHeritage} style={styles.btn}>
						<Text style={styles.btnTxt}>Explore Inside {className}</Text>
					</TouchableOpacity>
				) : null}

				<FlatList
					data={finalData}
					keyExtractor={(item) => item._id}
					renderItem={renderItem}
				/>
				</ScrollView>
				{/* <View>
                <TouchableOpacity onPress={fetchInsideHeritage}>
				<Text>Press for More info</Text></TouchableOpacity>
			</View> */}

			</View>
		</>
	);
};

const styles = StyleSheet.create({
	topCard: {
		borderRadius: 8,
		borderColor: 'grey',
		paddingHorizontal: 5,
		paddingVertical: 3,
		borderWidth: 1,
		backgroundColor: COLORS.light
	},
	cardContainer: {
		alignContent: 'center',
		// backgroundColor:'red',
		alignItems: 'center'
	},
	smallCard: {
		flexDirection: 'row',
		backgroundColor: 'white',
		borderRadius: 10,
		margin: 10,
		elevation: 3, // for shadow on Android
		shadowColor: '#000', // for shadow on iOS
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.3,
		shadowRadius: 2,
		width: '80%',
	},
	cardImage: {
		width: 80,
		height: 80,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		resizeMode: 'cover',
	},
	cardContent: {
		flex: 1,
		padding: 10,
		alignItems: 'center', // Align text in the center horizontally
		justifyContent: 'center', // Align text in the center vertically
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: "black"
	},
	btn: {
		backgroundColor: COLORS.primary, // Use your preferred color
		padding: 10,
		marginTop: 10,
		// marginHorizontal: 10,
		alignItems: 'center',
		borderRadius:5,
		marginBottom: 20
	},
	btnTxt: {
		color: COLORS.white,
	},
	// container: {
	// 	flex: 1,
	// 	backgroundColor: COLORS.white,
	// 	position: 'relative',
	// },
	// ScrollView: {
	// 	paddingHorizontal: 15,
	// },
	// headingView: {
	// 	margin: 10,
	// 	flexDirection: 'row'
	// },
	// headingText: {
	// 	fontSize: 20,
	// 	fontWeight: 'bold',
	// 	color: COLORS.primary,
	// },
	// detailText: {
	// 	fontSize: 17,
	// 	color: COLORS.dark,
	// 	paddingVertical: 4,
	// },
	// image: {
	// 	height: 300,
	// 	width: '100%',
	// },
	// backBtn: {
	// 	position: 'absolute',
	// 	left: 20,
	// 	top: 20,
	// 	zIndex: 5,
	// },
	topCard: {
		borderRadius: 8,
		borderColor: 'grey',
		paddingHorizontal: 5,
		paddingVertical: 3,
		borderWidth: 1,
		backgroundColor: COLORS.light
	},
	container: {
		marginTop: 50,
		flex: 1,
		backgroundColor: COLORS.white,
		position: 'relative',
	},
	content: {
		// marginTop: 300,
		paddingTop: 20,
		top: -20,
		paddingHorizontal: 20
	},
	ScrollView: {
		paddingHorizontal: 25,
	},
	headingView: {
		margin: 10,
		flexDirection: 'row'
	},
	headingText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: COLORS.primary,
	},
	detailText: {
		fontSize: 17,
		color: COLORS.dark,
		paddingVertical: 4,
	},
	image: {
		height: 300,
		width: '100%',
		// position: 'absolute', zIndex:2
	},
	backBtn: {
		position: 'absolute',
		left: 20,
		top: 20,
		zIndex: 5,
	},
	actionText: {
		color: "black",
	},
	group: {
		alignItems: 'center'
	},
	actionIcon: {
		backgroundColor: COLORS.secondary,
		padding: 5,
		borderRadius: 100,

	}
});

export default SemiFinalDetailsScreen;