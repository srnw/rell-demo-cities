const pcl = require('postchain-client');
// using default postchain node REST API port
// On rellide-staging.chromia.dev, check node log for api url
const node_api_url = "http://localhost:7740";
// default blockchain identifier used for testing
// get RID by calling http://localhost:7740/brid/iid_1
const blockchainRID = "AD601A1F568B6520DE55919816D19E9E57CFA3BD9B533F327DCA8BD91398A4AF";
const rest = pcl.restClient.createRestClient(node_api_url, blockchainRID, 5);

const gtx = pcl.gtxClient.createClient(rest, Buffer.from(blockchainRID, 'hex'), []);

startup();

async function is_city_registered(){
	console.log(await gtx.query("is_city_registered", {city_name: "Kiev test"}));
}

async function get_city(){
	console.log(await gtx.query("get_city", {city_name: "Kiev test"}));
}

async function insert(){
	const user = pcl.util.makeKeyPair();
	const tx = gtx.newTransaction([user.pubKey]);

	tx.addOperation('insert_city', "Kiev");
	tx.addOperation('insert_city', "Stockholm");
	tx.addOperation('insert_city', "Tel Aviv");
	tx.addOperation('insert_city', "Hamburg");

	tx.sign(user.privKey, user.pubKey);

	await tx.postAndWaitConfirmation();
}

async function startup(){
	await insert();
	await is_city_registered();
	await get_city();
}


