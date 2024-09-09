module.exports.runtime = {
    handler: async function ({ amount, from, to }) {
      const callerId = `${this.config.name}-v${this.config.version}`;
      try {
        this.introspect(
          `${callerId} called with amount:${amount} from:${from} to:${to}...`
        );
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${from}`
        );
        const data = await response.json();

        this.introspect(
            `data: ${JSON.stringify(data)}`
        );

        if (!data.rates[to]) {
          throw new Error(`Invalid currency code: ${to}`);
        }

        const rate = data.rates[to];
        const convertedAmount = amount * rate;

        return JSON.stringify({
          from,
          to,
          amount,
          convertedAmount: convertedAmount.toFixed(2),
          rate
        });
      } catch (e) {
        this.introspect(
          `${callerId} failed to invoke with amount:${amount} from:${from} to:${to}. Reason: ${e.message}`
        );
        this.logger(
          `${callerId} failed to invoke with amount:${amount} from:${from} to:${to}`,
          e.message
        );
        return `The currency conversion failed. Error: ${e.message}`;
      }
    }
  };