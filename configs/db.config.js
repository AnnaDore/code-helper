const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/programming-helper', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => {
    console.error('Error connecting to mongo', err)
    process.exit(1);
  });
