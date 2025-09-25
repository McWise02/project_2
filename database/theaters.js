const { getDb } = require("./connect");
const { ObjectId } = require("mongodb");

async function get(id) {
  const db = getDb();
  console.log("get theater id:", id);

  const result = await db
    .collection("theaters")
    .findOne({ _id: new ObjectId(id) });

  console.log("DB result:", result);
  return result;
}

async function getAll() {
  const db = getDb();
  console.log("Fetching all theaters...");

  const result = await db
    .collection("theaters")
    .find()
    .toArray();

  console.log("DB result:", result);
  return result;
}

async function create(theater) {
  if (!theater || typeof theater.toJSONCreate !== "function") {
    throw new Error("create() expects a Theater instance");
  }

  const db = getDb();
  const result = await db
    .collection("theaters")
    .insertOne(theater.toJSONCreate());

  console.log("DB result:", result);
  return result;
}

async function update(theater) {
  if (!theater || typeof theater.buildUpdateFields !== "function") {
    throw new Error("update() expects a Theater instance");
  }
  if (!theater.id) {
    throw new Error("Theater instance must include an id for update");
  }

  const db = getDb();
  const updateFields = theater.buildUpdateFields();

  const result = await db.collection("theaters").updateOne(
    { _id: new ObjectId(theater.id) },
    { $set: updateFields }
  );

  console.log("DB result:", result);
  return result;
}

async function deleteOne(id) {
  const db = getDb();
  console.log("delete theater id:", id);

  const result = await db
    .collection("theaters")
    .deleteOne({ _id: new ObjectId(id) });

  console.log("DB result:", result);
  return result;
}

module.exports = { get, getAll, create, update, deleteOne };
