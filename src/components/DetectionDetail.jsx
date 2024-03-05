import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import COLORS from '../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';


import ExpandableCard from '../componentsSaurav/customComponents/ExpandableCard';
import CustomHeader from '../componentsSaurav/customComponents/CustomHeader';
import ActionCard from '../componentsSaurav/customComponents/ActionCard';
import { getmyLocation } from '../ComponentsPrajwol/modules/getMyLocation';
import calculateDistanceDuration from '../ComponentsPrajwol/modules/calculateDistanceDuration';



const FinalDetailsScreen = ({ navigation, route }) => {
	const { _id, className, architectureStyle, constructedBy, Ticket, Description, imageLink, constructionDate, latitude, longitude, Location, Year, imageUrl, name, description } = route.params;
	const [distance, setDistance] = useState(null);
	const [myLocation, setMyLocation] = useState({})
	const [distanceDuration, setDistanceDuration] = useState({})


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
	},
	actionIcon: {
		backgroundColor: COLORS.secondary,
		padding: 5,
		borderRadius: 100,

	}
});

export default FinalDetailsScreen;

//last one in the stack