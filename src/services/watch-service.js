const { ObjectId } = require('bson');

function makeWatchService(db) {

  async function createWatch(row) {
    const createdAt = new Date();
    const _row = { ...row, createdAt, updatedAt: createdAt };
    return db.watchColl.insertOne(_row);
  }

  async function retrieveWatch(_id) {
    return db.watchColl.findOne({ _id: new ObjectId(_id) });
  }

  async function retrieveWatchByImei(imei) {
    return db.watchColl.findOne({ imei });
  }

  async function updateWatch(_id, changes) {
    const updatedAt = new Date();
    const $set = { ...changes, updatedAt };
    return db.watchColl.updateOne({ _id: new ObjectId(_id) }, { $set });
  }

  async function updateWatchByImei(imei, changes) {
    const watch = await retrieveWatchByImei(imei);
    if (watch) {
      const $set = { ...changes, updatedAt: new Date() };
      return db.watchColl.updateOne({ _id: new ObjectId(watch._id) }, { $set });
    }
    return null;
  }

  async function upsertWatchByImei(imei, details) {
    const filter = { imei };
    const updateDoc = {
      $set: {
        imei,
        ...details,
      },
    };
    const options = { upsert: true };
    return db.watchColl.updateOne(filter, updateDoc, options);
  }

  async function deleteWatch(_id) {
    return db.watchColl.deleteOne({ _id: new ObjectId(_id) });
  }

  async function deleteWatchByImei(imei) {
    return db.watchColl.deleteOne({ imei });
  }

  async function deleteWatchesByImeiList(imeiList) {
    return db.watchColl.deleteMany({ imei: { $in: imeiList }});
  }

  return {
    createWatch,
    retrieveWatch,
    retrieveWatchByImei,
    updateWatch,
    updateWatchByImei,
    upsertWatchByImei,
    deleteWatch,
    deleteWatchByImei,
    deleteWatchesByImeiList,
  };
}

module.exports = { makeWatchService };