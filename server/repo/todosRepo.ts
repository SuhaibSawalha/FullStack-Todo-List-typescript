interface TodoType {
  _id: number;
  todo: string;
  completed: boolean;
}

let currentId = 1;

type TodoWithouId = Omit<TodoType, "_id">;

const todosRepo = () => {
  const load = async (todos: TodoWithouId[]) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const newTodos: TodoType[] = todos.map((todo) => {
          return { ...todo, _id: currentId++ };
        });
        const results = await collection.insertMany(newTodos);
        resolve(results);
      } catch (err) {
        reject(err);
      } finally {
        client.close();
      }
    });
  };

  const get = async (query = {}, limit = 0) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const results = await collection.find(query).toArray();
        if (limit > 0) return results.slice(0, limit);
        resolve(results);
      } catch (err) {
        reject(err);
      } finally {
        client.close();
      }
    });
  };

  const getById = async (id: number) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const results = await collection.findOne({ _id: id });
        resolve(results);
      } catch (err) {
        reject(err);
      } finally {
        client.close();
      }
    });
  };

  const post = async (todo: TodoWithouId) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const newTodo: TodoType = { ...todo, _id: currentId++ };
        const result = await collection.insertOne(newTodo);
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        client.close();
      }
    });
  };

  const put = async (id: number, todo: TodoWithouId) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.replaceOne({ _id: id }, todo);
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        client.close();
      }
    });
  };

  const remove = async (id: number) => {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne({ _id: id });
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        client.close();
      }
    });
  };

  return { load, get, getById, post, put, remove };
};

module.exports = todosRepo();
