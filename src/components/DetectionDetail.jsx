import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, StatusBar, Pressable, TouchableOpacity, Touchable } from 'react-native';

import COLORS from '../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

import { MAPS_API_KEY } from '../componentsSaurav/config';
import ExpandableCard from '../componentsSaurav/customComponents/ExpandableCard';
import CustomHeader from '../componentsSaurav/customComponents/CustomHeader';
import ActionCard from '../componentsSaurav/customComponents/ActionCard';


const FinalDetailsScreen = ({ navigation, route }) => {
	const { _id, className, architectureStyle, constructedBy, Ticket, Description, imageLink, constructionDate, latitude, longitude, Location, Year, imageUrl, name, description } = route.params;
	const [distance, setDistance] = useState(null);
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
					console.log('Location permission granted');

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
									console.log('Data from API:', data);
									const distanceText = data.rows[0].elements[0].distance.text;
									const durationText = data.rows[0].elements[0].duration.text;
									console.log("******************")
									console.log(distanceText);
									console.log(durationText);

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




	return (
		<>
			<CustomHeader title={className} />
			<View style={styles.container}>
				{/* <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0.2)" /> */}
				{/* {imageLink && <ImageBackground source={{ uri: imageLink }} style={styles.image} >
            </ImageBackground>} */}
				{imageLink || imageUrl ? (
					<Image source={{ uri: imageLink || imageUrl }} style={styles.image} />

				) : null}

				<ActionCard>
				<TouchableOpacity style={styles.group}>
						<IconM name='map-marker-distance' color={COLORS.primary} size={30} />
						<Text style={styles.actionText}>{distance?.distanceText || "Distance"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.group}>
						<Icon name='time-to-leave' color={COLORS.primary} size={30} />
						<Text style={styles.actionText}>{distance?.durationText || "Duration "}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.group}>
						{latitude && longitude && <Icon name='map' color={COLORS.primary} size={30} style={styles.icon} onPress={() => navigation.navigate('Maps', { location: { latitude, longitude }, name: className })} />}
						<Text style={styles.actionText}>View on map</Text>
					</TouchableOpacity>
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
					<TouchableOpacity style={styles.topCard}>
						{architectureStyle && <Text style={styles.detailText}>Architecture Style: {architectureStyle}</Text>}
						{/* {constructedBy && <ExpandableCard title={"constructed By"} details={constructedBy} />} */}
						{constructedBy && <Text style={styles.detailText}>Constructed By: {constructedBy}</Text>}
						{constructionDate && <Text style={styles.detailText}>Constructed in: {constructionDate}</Text>}
						{Ticket && <Text style={styles.detailText}>Ticket Required: {Ticket}</Text>}
					</TouchableOpacity>

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
	}
});

export default FinalDetailsScreen;

//last one in the stack