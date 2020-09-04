import { MongoMemoryServer } from 'mongodb-memory-server';
import moongose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'bla';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await moongose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await moongose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await moongose.connection.close();
});
