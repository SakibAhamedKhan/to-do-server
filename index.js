const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();



// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uoakm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
	try{
		await client.connect();
		const taskCollection = client.db("db_to_do").collection("task");
		
		app.post('/addTask', async(req, res) => {
			const doc = req.body;
			const result = await taskCollection.insertOne(doc);
			res.send(result);
		})
		app.get('/task/:email', async(req, res) => {
			const email = req.params.email;
			const query = {email: email};
			const result = await taskCollection.find(query).toArray();
			res.send(result);
		})
		app.put('/task/:email', async(req, res) => {
			const email = req.params.email;
			const docs = req.body;
			const id = docs.id;
			const filter = {email: email, _id: ObjectId(id)};
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					complete:true
				},
			  };
			const result = await taskCollection.updateOne(filter, updateDoc, options);
			res.send(result);
		})

		app.delete('/task/:email', async(req, res) => {
			const email = req.params.email;
			const docs = req.body;
			const id = docs.id;
			const query = {email: email, _id: ObjectId(id)};
			const result = await taskCollection.deleteOne(query);
			res.send(result);
		})



	} finally{

	}
}
run().catch(console.dir);



app.get('/', (req, res) => {
	res.send('To do server is running');
})
app.listen(port, () => {
	console.log('To do server is running');
})