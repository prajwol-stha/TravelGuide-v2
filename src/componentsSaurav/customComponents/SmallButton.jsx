import {  Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants/colors';

const SmallButton = ({ title, onPress, iconName, iconSize, iconColor, btnBgColor, btnTextColor }) => {

    const styles = StyleSheet.create({
        button: {
            backgroundColor: COLORS.primary,
            color: 'white',
            borderRadius: 5,
            minWidth: 100,
            minHeight: 40,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 3,
            paddingVertical:1,
            alignSelf: 'center',
            margin: 10,
            overflow: 'hidden'
        },
        title: {
            color: 'white',
            fontSize: 16,
        }
    })
    return (
        <Pressable
            onPress={onPress}
            style={[styles.button, btnBgColor && { backgroundColor: btnBgColor }]}
            android_ripple={{
                foreground: true, 
                radius:100, 
                color:"rgba(255,255,255,0.2)",
                borderless: false,
            }}
        >
            {iconName && <Icon name={iconName} size={iconSize ? iconSize : 24} color={iconColor ? iconColor : 'white'} />}
            <Text style={[styles.title, btnTextColor && { color: btnTextColor }]}> {title}</Text>
        </Pressable>
    )
}

export default SmallButton