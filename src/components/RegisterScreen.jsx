import { Pressable, ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import COLORS from '../constants/colors';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import userRegister from '../componentsSaurav/apiCalls/userRegister';

const RegisterScreen = ({ navigation }) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)


    const createRegisterData = () => {
        const data = new URLSearchParams();
        firstName.trim() !== '' && data.append('firstName', firstName);
        lastName.trim() !== '' && data.append('lastName', lastName);
        userName.trim() !== '' && data.append('userName', userName.toLowerCase());
        email.trim() !== '' && data.append('email', email.toLowerCase());
        password.trim() !== '' && data.append('password', password);
        return data;
    };


    const validateForm = () => {
        let errors = {};

        if (!firstName) errors.firstName = "First name is required";
        if (!lastName) errors.lastName = "Last name is required";
        if (!userName) {
            errors.userName = "Username is required";
        } else {
            if (/[A-Z]/.test(userName)) {
                errors.userName = "Username must have small letters";
            } else if (userName.length < 5) {
                errors.userName = "Username must be at least 5 characters long";
            } else if (/\W/.test(userName)) {
                errors.userName = "Username cannot contain symbols";
            } else if (/\d/.test(userName[0])) {
                errors.userName = "Username cannot start with a number";
            }
        }
        if (!email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email address is invalid";
        }
        if (!password) errors.password = "Password is required";
        else if (password.length < 6)
            errors.password = "Password must be at least 6 characters long";

        setErrors(errors);

        return Object.keys(errors).length === 0; // true if no error messages
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true)
            const data = createRegisterData();
            const response = await userRegister(data)
            if (response) {
                setLoading(false)
                navigation.navigate("Login")
            }
            setLoading(false)
        }
    };

    const handleFirstNameChange = (text) => {
        const lettersOnly = text.replace(/[^a-zA-Z]/g, ''); // Replace non-letter characters with an empty string
        setFirstName(lettersOnly);
        // validateForm();
    };
    

    const handleLastNameChange = (text) => {
        const lettersOnly = text.replace(/[^a-zA-Z]/g, ''); // Replace non-letter characters with an empty string
        setLastName(lettersOnly);
        // validateForm();
    };

    const handleUserNameChange = (text) => {
        setUserName(text);
        // validateForm();
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        // validateForm();
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        // validateForm();
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <ScrollView style={styles.container}>
            {/* <StatusBar translucent backgroundColor="rgba(0,0,0,0)" /> */}

            <View style={styles.collection}>
                <Text style={styles.headingText}>First name</Text>
                <TextInput
                    placeholder='First name'
                    placeholderTextColor={COLORS.placeholder}
                    style={[styles.inputField, errors?.firstName && { borderColor: COLORS.error }]}
                    value={firstName}
                    onChangeText={handleFirstNameChange}
                />
            </View>
            {errors?.firstName && <Text style={[styles.headingText, styles.errorText]}>{errors.firstName}</Text>}


            <View style={styles.collection}>
                <Text style={styles.headingText}>Last name</Text>
                <TextInput
                    placeholder='Last name'
                    placeholderTextColor={COLORS.placeholder}
                    style={[styles.inputField, errors?.lastName && { borderColor: COLORS.error }]}
                    value={lastName}
                    onChangeText={handleLastNameChange}
                />
            </View>
            {errors?.lastName && <Text style={[styles.headingText, styles.errorText]}>{errors.lastName}</Text>}

            <View style={styles.collection}>
                <Text style={styles.headingText}>Username</Text>
                <TextInput
                    placeholder='A unique username just for '
                    placeholderTextColor={COLORS.placeholder}
                    style={[styles.inputField, errors?.userName && { borderColor: COLORS.error }]}
                    value={userName}
                    onChangeText={handleUserNameChange}
                />
            </View>
            {errors?.userName && <Text style={[styles.headingText, styles.errorText]}>{errors.userName}</Text>}

            <View style={styles.collection}>
                <Text style={styles.headingText}>Email</Text>
                <TextInput
                    placeholder='Your email'
                    placeholderTextColor={COLORS.placeholder}
                    style={[styles.inputField, errors?.email && { borderColor: COLORS.error }]}
                    value={email}
                    onChangeText={handleEmailChange}
                />
            </View>
            {errors?.email && <Text style={[styles.headingText, styles.errorText]}>{errors.email}</Text>}

            <View style={styles.collection}>
                <Text style={styles.headingText}>Password</Text>
                <TextInput
                    placeholder='create a strong password'
                    placeholderTextColor={COLORS.placeholder}
                    style={[styles.inputField, errors?.password && { borderColor: COLORS.error }]}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                />
                <View style={styles.passwordSwitch}>
                    {/* <Text style={styles.headingText}>Password visibility</Text> */}
                    {/* <Switch
					value={showPassword}
					onChange={togglePasswordVisibility}
					trackColor={COLORS.placeholder}
					thumbColor={COLORS.primary}
				/> */}
                    <Icon color={COLORS.placeholder} size={30} name={showPassword ? 'eye' : 'eye-off'} onPress={togglePasswordVisibility} />
                </View>
            </View>
            {errors?.password && <Text style={[styles.headingText, styles.errorText]}>{errors.password}</Text>}

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
                                <Text style={styles.btnTxt}>Registering..</Text>
                                <ActivityIndicator color={COLORS.white} />
                            </View>
                            : <Text style={styles.btnTxt}>Register</Text>
                        }
                    </View>
                </Pressable>
            </View>


        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: COLORS.background
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
        flexDirection: 'row'
    },
    passwordSwitch: {
        // flexDirection : 'row',
        // alignItems: "center",
        // justifyContent: "flex-end",
        // gap: 4,
        position: 'absolute',
        top: 33,
        right: 8
    }
});

export default RegisterScreen;