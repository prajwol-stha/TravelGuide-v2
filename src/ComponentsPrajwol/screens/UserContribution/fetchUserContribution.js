import { CLUSTER_NAME_USER, COLLECTION_NAME_USER, DATABASE_ENDPOINT_USER, DATABASE_NAME_USER, MONGODB_API_KEY_USER } from "./UserContributionConfig"


const fetchUserContribution = async () => {
    console.log("inside fetch")
	let response
	try {

		response = await fetch(DATABASE_ENDPOINT_USER,
			{
				method: 'POST',
				cache: 'no-cache', //may break api , remove is problem occurs
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'apiKey': MONGODB_API_KEY_USER
				},
				body: JSON.stringify({
					'dataSource': CLUSTER_NAME_USER,
					'database': DATABASE_NAME_USER,
					'collection': COLLECTION_NAME_USER,
					// 'filter': {
					// 	'classNumber': classNumber
					// }
				})
			})

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const details = await response.json();
		// console.log(details)
		return (details)

	} catch (error) {
		console.error('fetch failed: ', error)
		// Alert.alert('fetch failed', error)
	}
}

export default fetchUserContribution