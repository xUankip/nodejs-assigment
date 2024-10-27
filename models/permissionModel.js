const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    url: { type: String, required: true },
    method: { type: String, required: true }
});

module.exports = mongoose.model('Permission', permissionSchema);
