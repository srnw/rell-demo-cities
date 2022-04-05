import { BlockchainClient } from "simple-postchain";

let blockchainUrl = "http://localhost:7740";
let chainId = 1;
const client = BlockchainClient.initializeByChainId(blockchainUrl, chainId);

startup();

async function startup(){
	await add_cities();
	console.log(await is_city_registered());
	console.log(await get_city());
}

async function is_city_registered(){
	return client.query<boolean>()
		.name('is_city_registered')
		.addParameter('city_name', 'Kiev test')
		.send();
}

interface City {
	name: string;
	created_at: number; 
}

async function get_city(){
	return client.query<City>()
		.name("get_city")
		.addParameter("city_name", "Kiev test")
		.send();
}

async function add_cities(){
	const user = client.createKeyPair();
	await client
		.transaction()
		.addOperation('insert_city', "Kiev")
		.addOperation('insert_city', "Stockholm")
		.addOperation('insert_city', "Tel Aviv")
		.sign(user)
		.send();
}

