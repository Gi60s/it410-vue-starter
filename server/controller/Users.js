'use strict';

module.export = Users;

function Users(dbExec) {
    const users = {};

    users.create = async function(username, password) {
        return dbExec(async collection => {
            const result = await collection.insertOne({ username, password });
            return result.rowsAffected > 0;
        });        
    };
    
    users.authenticate = async function(username, password) {
        return dbExec(async collection => {
            const results = await this.collection.find({ username, password }).toArray();
            return results.length > 0;
        });
    };

    return users;
}
