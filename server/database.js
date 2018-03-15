'use strict';
const MongoClient = require('mongodb').MongoClient;

module.exports = function(dbName) {
    const promise = MongoClient.connect('mongodb://localhost:27017/' + dbName);
    return async function dbExec(callback) {
        const conn = await promise;
        const collection = conn.collection('users');
        const data = await callback(collection);
        conn.close();
        return data;
    }
}
