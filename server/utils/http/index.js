function reqBody(request) {
  return typeof request.body === 'string'
    ? JSON.parse(request.body)
    : request.body;
}

function queryParams(request) {
  return request.query;
}

module.exports = {
  reqBody,
  queryParams,
};
