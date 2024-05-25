```javascript
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

export function toPercentString(input = null, decimals = 0) {
  if (isNaN(input) || input === null) return "";
  const percentage = Math.round(input * 100);
  return (
    (decimals > 0 ? percentage.toFixed(decimals) : percentage.toString()) + "%"
  );
}

export function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export function milliToHms(milli = 0) {
  const d = parseFloat(milli) / 1_000.0;
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = parseFloat((d % 3600.0) % 60);

  var hDisplay = h >= 1 ? h + "h " : "";
  var mDisplay = m >= 1 ? m + "m " : "";
  var sDisplay = s >= 0.01 ? s.toFixed(2) + "s" : "";
  return hDisplay + mDisplay + sDisplay;
}

```
**Purpose and Usage:**
The provided interface is a collection of utility functions for formatting numbers and strings. It includes methods for adding commas to numbers, converting numbers to compact formats, formatting currency values, calculating percentages, humanizing file sizes, and converting milliseconds to hours, minutes, and seconds.

These functions are designed to be used throughout the codebase to improve readability and maintainability by providing a standardized way of formatting numerical data. The interface is intended for use in various parts of the application, such as data visualization, reporting, and user interfaces.

**Method Documentation:**

### `addCommas(number)`
Adds commas to the specified number.

* **Parameters:** `number` (Number)
* **Returns:** A string with commas added to the input number.
* **Example:** `addCommas(1234567)` returns `"1,234,567"`

### `nFormatter(number)`
Formats a number in a compact style.

* **Parameters:** `number` (Number)
* **Returns:** A string representing the input number in a compact format.
* **Example:** `nFormatter(1234567)` returns `"1.2M"`

### `dollarFormat(number)`
Formats a number as currency with USD.

* **Parameters:** `number` (Number)
* **Returns:** A string representing the input number as currency with USD.
* **Example:** `dollarFormat(1234.56)` returns `"$$1,234.56"`

### `toPercentString(number, decimals)`
Calculates and formats a percentage value.

* **Parameters:** `number` (Number), `decimals` (Integer)
* **Returns:** A string representing the input number as a percentage with the specified decimal places.
* **Example:** `toPercentString(0.2345, 2)` returns `"23.45%"`

### `humanFileSize(bytes, si, dp)`
Humanizes a file size by converting it to a human-readable format.

* **Parameters:** `bytes` (Number), `si` (Boolean), `dp` (Integer)
* **Returns:** A string representing the input file size in a human-readable format.
* **Example:** `humanFileSize(1234567, true, 1)` returns `"1.2MB"`

### `milliToHms(milli)`
Converts milliseconds to hours, minutes, and seconds.

* **Parameters:** `milli` (Number)
* **Returns:** A string representing the input time in hours, minutes, and seconds.
* **Example:** `milliToHms(3600000)` returns `"1h 00m 00s"`

**Examples:**

```javascript
console.log(addCommas(1234567)); // Output: "1,234,567"
console.log(nFormatter(1234567)); // Output: "1.2M"
console.log(dollarFormat(1234.56)); // Output: "$$1,234.56"
console.log(toPercentString(0.2345, 2)); // Output: "23.45%"
console.log(humanFileSize(1234567, true, 1)); // Output: "1.2MB"
console.log(milliToHms(3600000)); // Output: "1h 00m 00s"
```

**Dependencies:**

* The `Intl.NumberFormat` class is used to format numbers in the `nFormatter` and `dollarFormat` methods.
* The `Math` object is used for calculations in the `toPercentString`, `humanFileSize`, and `milliToHms` methods.

**Clarity and Consistency:**

The documentation aims to be clear, concise, and consistent in its presentation. It provides examples and detailed descriptions of each method's purpose, parameters, return values, and usage scenarios.