import { Db, MongoClient } from 'mongodb';
import Status from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import { APIResponse } from 'src/interfaces/backend';

const url = require('url');

// Adds complexity to the key
const RANDOM_KEY = 'UAF7EeHWsF7cL73i4A3';
const expires = () => {
  const expiresDate = new Date();
  expiresDate.setHours(23, 59, 59, 0);
  return expiresDate.getTime();
};

export const isValidKeyForRole = async (
  key: string,
  role: string
): Promise<boolean> => await bcrypt.compare(expires() + role + RANDOM_KEY, key);

export const getKeyForRole = async (role: string) =>
  await bcrypt.hash(expires() + role + RANDOM_KEY, 10);

let cachedDb: Db;
export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  const uri = process.env.MONGODB_URI ?? '';

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = await client.db(url.parse(uri).pathname.substr(1));

  cachedDb = db;
  return db;
};

export const getBody = async (method: string, rawBody: string) => {
  if (method !== 'POST' || !rawBody) {
    throw new Error('Method not allowed.');
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (error) {
    throw new Error('Body is corrupted!');
  }

  return body;
};

export const insertOne = async (
  collection: string,
  body: any
): Promise<APIResponse> => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection(collection).insertOne(body);
    return {
      code: Status.CREATED,
      error: false,
      message: '',
      data: result
    };
  } catch (err) {
    return {
      code: Status.INTERNAL_SERVER_ERROR,
      error: true,
      message: err.message,
      data: []
    };
  }
};

export const getAll = async (
  collection: string,
  find: any = {}
): Promise<APIResponse<Array<any>>> => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection(collection).find(find).toArray();
    return {
      code: Status.ACCEPTED,
      error: false,
      message: '',
      data: result
    };
  } catch (err) {
    return {
      code: Status.INTERNAL_SERVER_ERROR,
      error: true,
      message: err.message,
      data: []
    };
  }
};
