import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../constants/colors';

const ExpandableCard = ({ title, details }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.card}>
            <View style={styles.head}>
                <Text style={styles.title}>{title}</Text>
                <Icon name={expanded ? "expand-less" : 'expand-more'} color={COLORS.placeholder} size={30} />
            </View>
            {expanded && <Text style={styles.details}>{details}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    head: {
        flexDirection: "row"
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        // margin: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 1,
        marginTop: 10,
        marginBottom: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: "black",
        flexGrow: 1
    },
    details: {
        marginTop: 10,
        color: 'black',
        fontSize: 16,
        textAlign: "justify",
        padding: 5
    },
});

export default ExpandableCard;
