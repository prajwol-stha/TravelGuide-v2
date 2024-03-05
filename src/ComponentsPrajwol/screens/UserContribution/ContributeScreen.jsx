import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Image, Switch, Alert } from 'react-native';
import COLORS from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getLocalImage from '../../../componentsSaurav/getImage/getLocalImage';
import addUserContribution from '../../../componentsSaurav/apiCalls/addUserContribution';
import { ActivityIndicator } from 'react-native';
import SmallButton from '../../../componentsSaurav/customComponents/SmallButton';
import { getmyLocation } from '../../modules/getMyLocation';



export default function ContributeScreen() {

	const [name, setName] = useState('');
	const [location, setLocation] = useState('');
	const [category, setCategory] = useState('');
	const [hasTicket, setHasTicket] = useState(false);
	const [ticketPrice, setTicketPrice] = useState('');
	const [description, setDescription] = useState('');
	const [imageUri, setImageUri] = useState(null);
	const [imageFile, setImageFile] = useState();
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [locationLoading, setLocationLoading] = useState(false)

	const validateForm = () => {
		const mapRegex = /^\d+\.\d+,\d+\.\d+$/
		let errors = {}
		if (!name) errors.name = "Name is required"
		if (!location) errors.location = "Location is required"
		if (!imageUri) errors.image = "Image is required"
		if (hasTicket && !ticketPrice) errors.ticketPrice = "Ticket Price is required"
		if (!mapRegex.test(location)) errors.location = "Location must be formatted as: 27.6704, 85.3274"
		setErrors(errors)

		return Object.keys(errors).length === 0; //true if no error messages
	}

	const resetForm = () => {
		setName('');
		setLocation('');
		setHasTicket(false);
		setTicketPrice('');
		setDescription('');
		setImageUri(null);
		setErrors({});
	};

	function createFormData() {
		const formData = new FormData();
		name.trim() !== '' && formData.append('name', name.toLowerCase());
		location.trim() !== '' && formData.append('location', location);
		category.trim() !== '' && formData.append('category', category);
		hasTicket && formData.append("ticketRequired", true)
		hasTicket && ticketPrice.trim() !== '' && formData.append('ticketPrice', ticketPrice);
		description.trim() !== '' && formData.append('description', description);
		imageFile && formData.append('placeImage', imageFile);
		return formData
	}

	async function handleSubmit() {
		if (validateForm()) {
			setLoading(true);
			const res = await addUserContribution(createFormData());
			if (res) {
				resetForm();
			}
			setLoading(false);
		}
	};


	async function handleAddImage() {
		const { imageFile, uri } = await getLocalImage();
		if (uri) {
			setImageUri(uri)
		}
		setImageFile(imageFile)
	}

	function clearImage() {
		setImageUri(null)
	}

	function toggleTicket() {
		setHasTicket(v => !v)
	}

	const handleTicketPriceChange = (text) => {
		// Remove any non-numeric characters from the input text
		const numericText = text.replace(/[^0-9]/g, '');
		setTicketPrice(numericText);
	};

	async function addCurrentLocation() {
		setLocationLoading(true)
		const { latitude, longitude } = await getmyLocation();
		setLocation(`${latitude},${longitude}`)
		setLocationLoading(false)
	}

	return (
		<ScrollView style={styles.container}>

			<Pressable
				onPress={handleAddImage}
				style={[styles.imageContainer, errors?.image && { borderColor: 'red' }]}
				android_ripple={{
					foreground: true,
					radius: 500,
					color: "rgba(0,0,0,0.1)",
					borderless: false,
				}}
			>
				{imageUri ? (<>
					<Image source={{ uri: imageUri }} style={styles.image} />
					<Pressable style={styles.imageIcon}
						android_ripple={{
							foreground: true,
							radius: 500,
							color: "rgba(255,255,255,0.5)",
							borderless: false,
						}}
						onPress={clearImage}
					>
						<Icon name='cancel' size={30} />
					</Pressable>

				</>
				) : (
					<View style={styles.placeholder}>
						{/* Placeholder content */}
						<Icon name='add-a-photo' size={50} color={COLORS.placeholder} />
						<Text style={styles.text}>Add an image*</Text>
					</View>
				)}
			</Pressable>
			{errors?.image && <Text style={[styles.headingText, styles.errorText]}>{errors.image}</Text>}

			<View style={styles.collection}>
				<Text style={styles.headingText}>Name</Text>
				<TextInput
					placeholder='Name of the place*'
					placeholderTextColor={COLORS.placeholder}
					style={[styles.inputField, errors?.name && { borderColor: COLORS.error }]}
					value={name}
					onChangeText={text => setName(text)}
				/>
			</View>

			{errors?.name && <Text style={[styles.headingText, styles.errorText]}>{errors.name}</Text>}

			<View style={styles.collection}>
				<Text style={styles.headingText}>Location</Text>
				<TextInput
					placeholder='Location of the site*'
					placeholderTextColor={COLORS.placeholder}
					style={[styles.inputField, errors?.location && { borderColor: COLORS.error }]}
					value={location}
					onChangeText={text => setLocation(text.replace(/[^.,\d]/g, ""))}
				/>
				<View style={{ position: "absolute", right: -5, top: 20 }}>
					{locationLoading ?
						<SmallButton title={<ActivityIndicator/>}/>
						:
						<SmallButton  iconName={"google-maps"} onPress={addCurrentLocation} />
					}
				</View>
			</View>

			{errors?.location && <Text style={[styles.headingText, styles.errorText]}>{errors.location}</Text>}


			<View style={[styles.collection, styles.ticketContainer]}>
				<Switch
					value={hasTicket}
					onChange={toggleTicket}
					trackColor={COLORS.placeholder}
					thumbColor={COLORS.primary}
				/>
				<Text style={styles.text}>Needs Ticket?</Text>
			</View>

			{hasTicket &&
				<>
					<View style={styles.collection}>
						<Text style={styles.headingText}>Ticket Price</Text>
						<TextInput
							placeholder='Ticket Price in Rupees*'
							placeholderTextColor={COLORS.placeholder}
							style={[styles.inputField, errors?.ticketPrice && { borderColor: COLORS.error }]}
							value={ticketPrice}
							onChangeText={text => handleTicketPriceChange(text)}
							keyboardType='numeric'
						/>
					</View>
					{errors?.ticketPrice && <Text style={[styles.headingText, styles.errorText]}>{errors.ticketPrice}</Text>}
				</>
			}


			<View style={styles.collection}>
				<Text style={styles.headingText}>Category</Text>
				<TextInput
					placeholder='Category'
					placeholderTextColor={COLORS.placeholder}
					style={styles.inputField}
					value={category}
					onChangeText={text => setCategory(text)}
				/>
			</View>


			<View style={styles.collection}>
				<Text style={styles.headingText}>Description</Text>
				<TextInput
					placeholder='Description'
					placeholderTextColor={COLORS.placeholder}
					style={[styles.inputField, styles.description]}
					multiline
					numberOfLines={4}
					value={description}
					onChangeText={text => setDescription(text)}
				/>
			</View>

			<View style={styles.collection}>
				<Pressable
					style={styles.btn}
					onPress={handleSubmit}
					android_ripple={{
						foreground: true,
						radius: 500,
						color: "rgba(255,255,255,0.2)",
						borderless: false,
					}}
					disabled={loading}
				>
					<View >
						{loading ?
							<View style={styles.btnContent}>
								<Text style={styles.btnTxt}>Adding&nbsp;&nbsp;</Text>
								<ActivityIndicator color={COLORS.white} />
							</View>
							: <Text style={styles.btnTxt}>Contribute</Text>
						}
					</View>
				</Pressable>
			</View>

		</ScrollView>
	);
};


const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		backgroundColor: COLORS.background,
	},
	collection: {
		marginTop: 20
	},
	headingText: {
		paddingLeft: 3,
		marginBottom: 3,
		color: "black"
	},
	inputField: {
		borderColor: "black",
		borderWidth: 1.5,
		borderRadius: 6,
		fontSize: 16,
		paddingLeft: 10,
		color: 'black'
	},
	description: {
		verticalAlign: "top"
	},
	btn: {
		backgroundColor: COLORS.primary,
		padding: 10,
		alignItems: 'center',
		borderRadius: 5,
	},
	btnTxt: {
		color: COLORS.white,
	},
	imageContainer: {
		marginTop: 20,
		height: 300,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f2f2f2',
		borderWidth: 2,
		borderColor: COLORS.placeholder,
		borderStyle: 'dotted',

	},
	placeholder: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	imageIcon: {
		position: "absolute",
		top: 5,
		right: 5,
		zIndex: 1
	},
	text: {
		fontSize: 16,
		color: "black"
	},
	ticketContainer: {
		flexDirection: 'row',
		justifyContent: "flex-end"
	},
	errorText: {
		marginTop: 0,
		color: COLORS.error
	},
	btnContent: {
		flexDirection: 'row',
		marginBottom: 20
	}
})