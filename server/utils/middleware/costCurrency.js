const { reqBody } = require("../http");
const {
  CURRENCY_EXCHANGE,
  resolveCurrency,
} = require("../helpers/currencyExchange");

/**
 * Resolves the currency developer API chat responses report costs in from the
 * `currency` body param or `X-Currency` header (USD when neither is supported)
 * and loads its exchange rate. Stream chunks are converted by
 * `writeResponseChunk`; sync handlers pass their result through
 * `convertResponseCosts` with `response.locals.costCurrency`.
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 * @param {NextFunction} next - The next function.
 */
async function costCurrency(request, response, next) {
  // Malformed bodies are rejected by the route handler, not here.
  let body = {};
  try {
    body = reqBody(request) ?? {};
  } catch {}

  const currency = resolveCurrency(body.currency, request.header("X-Currency"));
  if (currency !== "USD") await CURRENCY_EXCHANGE.getRates();
  response.locals.costCurrency = currency;
  next();
}

module.exports = {
  costCurrency,
};
