const redisClient = require('./redis-client');
const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// during login for new user
app.post('/store/:key', async (req, res) => {
  const { key } = req.params;
  console.log("POST request received for key " + key)
  const myTokens = JSON.stringify(req.body);
  //console.log("Body: " + myTokens);
  var ttl = req.header("ttl");
  if (ttl < 30) {
    ttl = 30;
  }
  await redisClient.setAsync(key, myTokens);
  await redisClient.expireAsync(key, ttl); // set expiry time
  return res.status(201).send('Success. Key valid until ' + ttl + " seconds");
});

// when user is logged out
app.delete('/store/:key', async (req, res) => {
  const { key } = req.params;
  await redisClient.delAsync(key);
  return res.status(204).send('Deleted');
});

// during session refresh
app.get('/store/:key', async (req, res) => {
  const { key } = req.params;
  const rawData = await redisClient.getAsync(key);
  // return 404 notfound is rawData is null
  if (rawData == null) {
    return res.status(404);
  }
  return res.status(200).send(JSON.parse(rawData));
});

// health
app.get('/', (req, res) => {
  return res.status(200).send('Redis client is working.....');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
