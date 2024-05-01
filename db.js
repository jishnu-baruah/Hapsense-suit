
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jsbaruah1:l8NxrUnQXxlCtcQZ@cluster0.rnuml2s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
// run().catch(console.dir);

const dbName = "mouli";               //this will be bookFairDb
const collectionName = "users";   //this will be users   in future

const displayAll = () => {
    return client.connect()             // to see all data in collection
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            console.log("============FOUND AND CONNECTED=============");

            return collection.find().toArray();
        })
        .then((documents) => {
            console.log(documents);
        })
        .catch((err) => {
            console.log(err, "error happened");
        }).finally(() => {
            return client.close();
        })
}

const user = { name: "raj", age: 33 };         //this is details sample

const insertUser = (user) => {
    return client.connect()
        .then(() => {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);        // Hardcoded user data

            return collection.insertOne(user);
        })
        .then((result) => {
            console.log('User inserted successfully:', result);
        })
};
insertUser(user)