const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const _ = {};

_.clone = function (data = {}) {
  const originalData = data?.toObject ? data.toObject() : data;
  const eType = originalData ? originalData.constructor : 'normal';
  if (eType === Object) return { ...originalData };
  if (eType === Array) return [...originalData];
  return data;
};

_.pick = function (obj, array) {
  const clonedObj = this.clone(obj);
  return array.reduce((acc, elem) => {
    if (elem in clonedObj) acc[elem] = clonedObj[elem];
    return acc;
  }, {});
};

_.encryptPassword = function (password) {
  return crypto.createHmac('sha256', process.env.JWT_SECRET).update(password).digest('hex');
};

_.encodeToken = function (body, expTime) {
  try {
    return expTime ? jwt.sign(this.clone(body), process.env.JWT_SECRET, expTime) : jwt.sign(this.clone(body), process.env.JWT_SECRET);
  } catch (error) {
    return undefined;
  }
};

_.decodeToken = function (token) {
  try {
    return jwt.decode(token, process.env.JWT_SECRET);
  } catch (error) {
    return undefined;
  }
};

module.exports = _;
