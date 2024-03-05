export default async function calculateDistanceDuration(origin, destination, mode = "driving") {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=${mode}&key=${"AIzaSyBvTNI4xJQqWuxb9sM148nsgBrSft59zWg"}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log('Data from API:', data.rows[0].elements);
            const distanceText = data.rows[0].elements[0].distance.text;
            const durationText = data.rows[0].elements[0].duration.text;
            return { distanceText, durationText };

        })
        .catch((error) => {
            console.error('Error fetching distance matrix:', error);
            return false
        });

}


// const origin = {latitude: 27.642434621702584, longitude: 85.37417718138163}
// const destination = {latitude: 27.666537604888124, longitude: 85.33237502622215}

// calculateDistanceDuration(origin, destination,'walking')