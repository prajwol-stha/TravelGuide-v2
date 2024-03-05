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

import { View, Text } from 'react-native'
import React from 'react'

const DetailsScreen = () => {
  return (
    <View>
      <Text>DetailsScreen</Text>
    </View>
  )
}

export default DetailsScreen