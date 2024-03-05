import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Pressable } from 'react-native';

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
	const { _id, className, architectureStyle, constructedBy, Ticket, Description, imageLink, constructionDate, latitude, longitude, Location, Year, imageUrl, name, description, ticketPrice, ticketRequired, price, image } = route.params;


	const [distanceDuration, setDistanceDuration] = useState({})
	const [finalData, setFinalData] = useState(null);

	async function fetchInsideHeritage() {
		const insideKDS = await fetchKDS();
		const insideKDSData = insideKDS.documents;
		setFinalData(insideKDSData.slice(0, 30));

	}
	async function handleClassItemPress(item) {
		const info = await fetchDetailsFromDb(item.classNumber)
		navigation.navigate('DetectionDetail', { ...info });

	}

	const renderItem = ({ item }) => (
		<View style={styles.cardContainer}>
			{/* <Pressable> */}
			<TouchableOpacity style={styles.smallCard}
				activeOpacity={0.8}
				onPress={() => handleClassItemPress(item)}
			>
				<Image source={{ uri: item.imageLink }} style={styles.cardImage} />
				<View style={styles.cardContent}>
					<Text style={styles.cardTitle}>{item.className}</Text>
				</View>
				{/* </Pressable> */}
			</TouchableOpacity>
		</View>
	);


	useEffect(() => {
		async function updateMyLocation() {
			const { latitude: mlat, longitude: mlng } = await getmyLocation()
			const { distanceText, durationText } = await calculateDistanceDuration({ latitude: mlat, longitude: mlng }, { latitude, longitude })
			const { durationText: walkingDuration } = await calculateDistanceDuration({ latitude: mlat, longitude: mlng }, { latitude, longitude }, "walking")
			setDistanceDuration({ distance: distanceText, drivingDuration: durationText, walkingDuration })
		}

		updateMyLocation();

	}, [])

	async function handleViewMap() {
		// console.log(`Navigating to ${latitude},${longitude}, ${className}`)
		navigation.navigate('Maps', { location: { latitude: Number(latitude), longitude: Number(longitude) }, name: `${className}` })
	}

	return (
		<>
			<CustomHeader title={className} />
			<View style={styles.container}>
				{imageLink || imageUrl ? (
					<Image source={{ uri: imageLink || imageUrl }} style={styles.image} />

				) : null}
				{image && <Image source={image} style={styles.image} />}

				<ActionCard>
					<TouchableOpacity style={styles.group}>
						<IconM name='map-marker-distance' color={COLORS.primary} size={30} style={styles.actionIcon} />
						<Text style={styles.actionText}>{distanceDuration?.distance || "Distance"}</Text>
					</TouchableOpacity>
					{/* <TouchableOpacity style={styles.group}>
						<Icon name='directions-bus' color={COLORS.primary} size={30} style={styles.actionIcon} />
						<Text style={styles.actionText}>{distanceDuration?.drivingDuration?.replace(/days?/g, "D")?.replace(/hours?/g, "H")?.replace(/mins?/g, "M") || "Drive"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.group}>
						<Icon name='directions-walk' color={COLORS.primary} size={30} style={styles.actionIcon} />
						<Text style={styles.actionText}>{distanceDuration?.walkingDuration?.replace(/days?/, "D")?.replace(/hours?/g, "H")?.replace(/mins?/g, "M") || "Walk"}</Text>
					</TouchableOpacity> */}
					<TouchableOpacity style={styles.group}>
						<Icon name='directions-bus' color={COLORS.primary} size={30} style={styles.actionIcon} />
						<Text style={styles.actionText}>{distanceDuration?.drivingDuration || "Drive"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.group}>
						<Icon name='directions-walk' color={COLORS.primary} size={30} style={styles.actionIcon} />
						<Text style={styles.actionText}>{distanceDuration?.walkingDuration || "Walk"}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.group} onPress={handleViewMap} >
						{latitude && longitude && <Icon name='map' color={COLORS.primary} size={30} style={styles.actionIcon} />}
						<Text style={styles.actionText}>View map</Text>
					</TouchableOpacity>

				</ActionCard>

				<ScrollView style={styles.content}>
					{(architectureStyle || constructedBy || constructionDate || Ticket || ticketRequired || ticketPrice || price) && <TouchableOpacity style={styles.topCard}>
						{architectureStyle && <Text style={styles.detailText}>Architecture Style: {architectureStyle}</Text>}
						{/* {constructedBy && <ExpandableCard title={"constructed By"} details={constructedBy} />} */}
						{constructedBy && <Text style={styles.detailText}>Constructed By: {constructedBy}</Text>}
						{constructionDate && <Text style={styles.detailText}>Constructed in: {constructionDate}</Text>}
						{Ticket && <Text style={styles.detailText}>Ticket Required: {Ticket}</Text>}
						{ticketRequired && <Text style={styles.detailText}>Ticket Required: Yes</Text>}
						{ticketPrice && <Text style={styles.detailText}>Ticket Price: {ticketPrice}</Text>}
						{price && <Text style={styles.detailText}>Price: {price}</Text>}
					</TouchableOpacity>}

					{(Description || description) && (<>

						<ExpandableCard title={"Description"} details={Description || description} />
					</>
					)}


					{className === "Kathmandu Durbar Square" ? (
						<TouchableOpacity onPress={fetchInsideHeritage} style={styles.btn}>
							<Text style={styles.btnTxt}>Explore Inside {className}</Text>
						</TouchableOpacity>
					) : null}

					<FlatList
						data={finalData}
						keyExtractor={(item) => item._id}
						renderItem={renderItem}
						horizontal={true}
					/>
				</ScrollView>


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
		alignItems: 'center',
		maxHeight: 300,
		// paddingBottom: 20,
		paddingRight: 10,
		marginBottom: 50,
		overflow: 'hidden',
	},
	smallCard: {
		flexDirection: 'column',
		backgroundColor: 'rgb(245,245,245)',
		borderRadius: 10,
		borderColor: "gray",
		// borderWidth: 1,
		// elevation: 2,
		overflow: "hidden",
		alignItems: "center",
		alignContent: "center",
	},
	cardImage: {
		width: 250,
		height: 250,
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
		backgroundColor: COLORS.primary, // 
		padding: 10,
		marginTop: 10,
		// marginHorizontal: 10,
		alignItems: 'center',
		borderRadius: 5,
		marginBottom: 20
	},
	btnTxt: {
		color: COLORS.white,
	},

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

	},
	backBtn: {
		position: 'absolute',
		left: 20,
		top: 20,
		zIndex: 5,
	},
	actionText: {
		color: "black",
		fontSize: 12
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