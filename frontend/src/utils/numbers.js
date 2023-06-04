const Formatter = Intl.NumberFormat("en", { notation: "compact" });

export function numberWithCommas(input) {
  return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function nFormatter(input) {
  return Formatter.format(input);
}

export function dollarFormat(input) {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
  }).format(input);
}
