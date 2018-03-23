const mongoose = require('mongoose');

const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

const TracesSchema = new Schema({
    id: ObjectId,
    sessionId: {type: String, required: true},
    data: {type: Schema.Types.Mixed, required: true}
});

const Traces = mongoose.model('Traces', TracesSchema);

module.exports = Traces;
