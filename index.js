const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

//midleware
app.use(cors());
app.use(express.json());

//database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6xivgke.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const sectorCollection = client.db('selector-form').collection('sector');
        const usersCollection = client.db('selector-form').collection('users');
        //api to get sectors data
        app.get('/sector', async(req, res)=>{
            const query = {};
            const sectors = await sectorCollection.find(query).toArray();
            res.send(sectors);
        })

        //api to get doctors data
        app.get('/users', async(req, res)=>{
            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

        //api to save users data in database
        app.post('/users', async(req, res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        
        //api for update user information
        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await usersCollection.updateOne(query, updatedDoc);
            res.send(result)
        })

        //api to delete user
        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}

run().catch((err)=> console.error(err))

app.get('/', async (req, res) => {
    res.send('Selector server is running.')
})

app.listen(port, () => console.log(`Selector server is running on port ${port}`))