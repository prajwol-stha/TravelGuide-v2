import { CLUSTER_NAME_WH, COLLECTION_NAME_WH, DATABASE_ENDPOINT_WH,MONGODB_API_KEY_WH ,DATABASE_NAME_WH} from "./WHconfig"


const fetchWH = async () => {
    console.log("inside fetch")
	let response
	try {

		response = await fetch(DATABASE_ENDPOINT_WH,
			{
				method: 'POST',
				cache: 'no-cache', //may break api , remove is problem occurs
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'apiKey': MONGODB_API_KEY_WH
				},
				body: JSON.stringify({
					'dataSource': CLUSTER_NAME_WH,
					'database': DATABASE_NAME_WH,
					'collection': COLLECTION_NAME_WH,
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

export default fetchWH