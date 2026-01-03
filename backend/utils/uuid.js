const { v4: uuidv4 } = require('uuid');

const generateUUID = async () => {
    const newUUID = uuidv4();
    return newUUID;
};

module.exports = {generateUUID};