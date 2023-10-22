function jsonStringify(obj) {
  let success = '', error = null;
  try {
    successs = JSON.stringify(obj);
  } catch (e) {
    error = e;
  }
  return { success, error };
}

function jsonParse(str) {
  let success = null, error = null;
  try {
    success = JSON.parse(str);
  } catch (e) {
    error = e;
  }
  return { success, error };
}

module.exports = { jsonStringify, jsonParse };
