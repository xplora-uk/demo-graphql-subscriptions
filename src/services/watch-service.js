const { ObjectId } = require('bson');

function makeWatchService(db) {

  async function create(row) {
    const createdAt = new Date();
    const _row = { ...row, createdAt, updatedAt: createdAt };
    return db.watchColl.insertOne(_row);
  }

  async function retrieve(_id) {
    return db.watchColl.findOne({ _id: new ObjectId(_id) });
  }

  async function retrieveByImei(imei) {
    return db.watchColl.findOne({ imei });
  }

  async function update(_id, changes) {
    const updatedAt = new Date();
    const $set = { ...changes, updatedAt };
    return db.watchColl.updateOne({ _id: new ObjectId(_id) }, { $set });
  }

  async function updateByImei(imei, changes) {
    const watch = await retrieveByImei(imei);
    if (watch) {
      const $set = { ...changes, updatedAt: new Date() };
      return db.watchColl.updateOne({ _id: new ObjectId(watch._id) }, { $set });
    }
    return null;
  }

  async function upsertByImei(imei, details) {
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

  async function delete_(_id) {
    return db.watchColl.deleteOne({ _id: new ObjectId(_id) });
  }

  async function deleteByImei(imei) {
    return db.watchColl.deleteOne({ imei });
  }

  async function deleteesByImeiList(imeiList) {
    return db.watchColl.deleteMany({ imei: { $in: imeiList }});
  }

  return {
    create,
    retrieve,
    retrieveByImei,
    update,
    updateByImei,
    upsertByImei,
    delete_,
    deleteByImei,
    deleteesByImeiList,
  };
}

module.exports = { makeWatchService };