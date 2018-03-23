const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const SessionsSchema = new Schema({
    id: ObjectId,
    sessionId: {type: String, default: '_sid'}
});

const Sessions = mongoose.model('Sessions', SessionsSchema);

module.exports = Sessions;
