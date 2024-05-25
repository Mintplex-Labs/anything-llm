```javascript
import { Tooltip as RechartsTooltip } from "recharts";

// Given a hex, convert to the opposite highest-contrast color
// and if `bw` is enabled, force it to be black/white to normalize
// interface.
function invertColor(hex, bw) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#FFFFFF" : "#000000";
    // : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

export default function Tooltip({ legendColor, ...props }) {
  return (
    <RechartsTooltip
      wrapperStyle={{ outline: "none" }}
      isAnimationActive={false}
      cursor={{ fill: "#d1d5db", opacity: "0.15" }}
      position={{ y: 0 }}
      {...props}
      content={({ active, payload, label }) => {
        return active && payload ? (
          <div className="bg-white text-sm rounded-md border shadow-lg">
            <div className="border-b py-2 px-4">
              <p className="text-elem text-gray-700 font-medium">{label}</p>
            </div>
            <div className="space-y-1 py-2 px-4">
              {payload.map(({ value, name }, idx) => (
                <div
                  key={`id-${idx}`}
                  className="flex items-center justify-between space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="shrink-0 h-3 w-3 border-white rounded-md rounded-full border-2 shadow-md"
                      style={{ backgroundColor: legendColor }}
                    />
                    <p
                      style={{
                        color: invertColor(legendColor, true),
                      }}
                      className="font-medium tabular-nums text-right whitespace-nowrap"
                    >
                      {value}
                    </p>
                  </div>
                  <p
                    style={{
                      color: invertColor(legendColor, true),
                    }}
                    className="whitespace-nowrap font-normal"
                  >
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }}
    />
  );
}

```
Based on the provided TypeScript, JSON, HTML, or JavaScript code, I will generate comprehensive documentation in Markdown format.

**Purpose and Usage:**
The `Tooltip` interface is designed to provide a customizable tooltip component for use in React applications. It allows developers to easily add tooltips to their charts and graphs, providing additional context and information to users. The interface provides various options for styling the tooltip, including custom colors, fonts, and layouts.

**Method Documentation:**

### `invertColor(hex, bw)`

* **Signature:** `function invertColor(hex, bw): string`
* **Purpose:** Inverts a given hex color code to its opposite highest-contrast color.
* **Parameters:**
	+ `hex`: A string representing the hex color code (e.g., "#FF0000").
	+ `bw`: A boolean indicating whether to force the result to be black/white for normalization.
* **Return value:** The inverted hex color code as a string.

Example usage:
```javascript
const originalColor = "#FF0000";
const invertedColor = invertColor(originalColor, true); // Returns "#FFFFFF"
```

### `padZero(str, len)`

* **Signature:** `function padZero(str, len): string`
* **Purpose:** Pads a given string with zeros to the specified length.
* **Parameters:**
	+ `str`: The input string.
	+ `len`: The desired length of the padded string (default is 2).
* **Return value:** The padded string.

Example usage:
```javascript
const originalString = "123";
const paddedString = padZero(originalString, 5); // Returns "00123"
```

### `Tooltip({ legendColor, ...props })`

* **Signature:** `function Tooltip({ legendColor, ...props }): JSX.Element`
* **Purpose:** Renders a customizable tooltip component.
* **Parameters:**
	+ `legendColor`: The color of the legend (default is null).
	+ `...props`: Additional props to be passed to the tooltip component.
* **Return value:** A JSX element representing the tooltip.

Example usage:
```javascript
const myTooltip = <Tooltip legendColor="#FF0000" />;
```

**Examples:**
To illustrate the usage of the interface, here are a few examples:

1. Basic usage:
```javascript
import { Tooltip } from 'my-library';
const myChart = <RechartsTooltip {...props} content={...} />; // Render the tooltip component
```
2. Customizing the legend color:
```javascript
import { Tooltip } from 'my-library';
const myChart = <Tooltip legendColor="#00FF00" {...props} content={...} />;
```

**Dependencies:**
The `Tooltip` interface depends on the `Recharts` library for rendering and styling purposes.

**Clarity and Consistency:**
This documentation aims to provide clear, concise, and consistent descriptions of each method, parameter, and return value. The examples illustrate how to use the interface effectively, while the dependencies section highlights any relevant relationships with other code components.