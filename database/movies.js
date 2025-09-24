const { getDb } = require("./connect");
const { ObjectId } = require("mongodb");

async function get(id) {
  const db = getDb();
  console.log(id);
  const result = await db
    .collection("movies")
    .findOne({ _id: new ObjectId(id) });

  console.log("DB result:", result);
  return result;
}

async function getAll() {
  const db = getDb();
  console.log("It's working");

  const result = await db
    .collection("movies")
    .find()
    .toArray();

  console.log("DB result:", result);
  return result;
}


async function create(movie) {
  if (!movie || typeof movie.toJSONCreate !== "function") {
    throw new Error("create() expects a Movie instance");
  }

  const db = getDb();
  const result = await db
    .collection("movies")
    .insertOne(movie.toJSONCreate());

  console.log("DB result:", result);
  return result;
}


async function update(movie) {
  if (!movie || typeof movie.buildUpdateFields !== "function") {
    throw new Error("update() expects a Movie instance");
  }
  if (!movie.id) {
    throw new Error("Movie instance must include an id for update");
  }

  const db = getDb();
  const updateFields = movie.buildUpdateFields();

  return db.collection("movies").updateOne(
    { _id: new ObjectId(movie.id) },
    { $set: updateFields }
  );
}

async function deleteOne(id) {
  const db = getDb();
  console.log(id);
  const result = await db
    .collection("movies")
    .deleteOne({ _id: new ObjectId(id) },);

  console.log("DB result:", result);
  return result;
}

module.exports = { get, getAll, update, create, deleteOne };
