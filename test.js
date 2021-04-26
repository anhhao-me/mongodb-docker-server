const MongoDBDockerServer = require('.');
const { MongoClient } = require('mongodb');
const debug = require('debug')('mongodb-docker-server:test');

const getClient = uri => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, _client) {
      if (err){
        reject(err);
        return;
      }
  
      const client = _client;
      debug('Create new mongodb instance');
      resolve(client);
    });
  });
};

;(async () => {
  const uri = await MongoDBDockerServer.start();
  console.log(`Receive URI: ${uri}`);
  const client = await getClient(uri);

  console.log(await client.db('test').stats());

  client.close();
  await MongoDBDockerServer.stop();
})();