import mongoose from 'mongoose';
import { app } from './app';
import { mongoUri, port } from '../config/config';

async function server() {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, () => {
      console.log(`server is listening to the port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

server();
