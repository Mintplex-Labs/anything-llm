```javascript
import { v4 } from "uuid";
import {
  AreaChart,
  BarChart,
  DonutChart,
  Legend,
  LineChart,
} from "@tremor/react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Funnel,
  FunnelChart,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Scatter,
  ScatterChart,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";
import { Colors, getTremorColor } from "./chart-utils.js";
import CustomCell from "./CustomCell.jsx";
import Tooltip from "./CustomTooltip.jsx";
import { safeJsonParse } from "@/utils/request.js";
import renderMarkdown from "@/utils/chat/markdown.js";
import { WorkspaceProfileImage } from "../PromptReply/index.jsx";
import { memo, useCallback, useState } from "react";
import { saveAs } from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import { CircleNotch, DownloadSimple } from "@phosphor-icons/react";

const dataFormatter = (number) => {
  return Intl.NumberFormat("us").format(number).toString();
};

export function Chartable({ props, workspace }) {
  const [getDivJpeg, { ref }] = useGenerateImage({
    quality: 1,
    type: "image/jpeg",
    options: {
      backgroundColor: "#393d43",
      padding: 20,
    },
  });
  const handleDownload = useCallback(async () => {
    const jpeg = await getDivJpeg();
    if (jpeg) saveAs(jpeg, `chart-${v4().split("-")[0]}.jpg`);
  }, []);

  const color = null;
  const showLegend = true;
  const content =
    typeof props.content === "string"
      ? safeJsonParse(props.content, null)
      : props.content;
  if (content === null) return null;

  const chartType = content?.type?.toLowerCase();
  const data =
    typeof content.dataset === "string"
      ? safeJsonParse(content.dataset, null)
      : content.dataset;
  const value = data.length > 0 ? Object.keys(data[0])[1] : "value";
  const title = content?.title;

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            <AreaChart
              className="h-[350px]"
              data={data}
              index="name"
              categories={[value]}
              colors={[color || "blue", "cyan"]}
              showLegend={showLegend}
              valueFormatter={dataFormatter}
            />
          </div>
        );
      case "bar":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            <BarChart
              className="h-[350px]"
              data={data}
              index="name"
              categories={[value]}
              colors={[color || "blue"]}
              showLegend={showLegend}
              valueFormatter={dataFormatter}
              layout={"vertical"}
              yAxisWidth={100}
            />
          </div>
        );
      case "line":
        return (
          <div className="bg-zinc-900 p-8 pb-12 rounded-xl text-white h-[500px] w-full">
            <h3 className="text-lg font-medium">{title}</h3>
            <LineChart
              className="h-[400px]"
              data={data}
              index="name"
              categories={[value]}
              colors={[color || "blue"]}
              showLegend={showLegend}
              valueFormatter={dataFormatter}
            />
          </div>
        );
      case "composed":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            {showLegend && (
              <Legend
                categories={[value]}
                colors={[color || "blue", color || "blue"]}
                className="mb-5 justify-end"
              />
            )}
            <ComposedChart width={500} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ transform: "translate(0, 6)", fill: "white" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: "translate(-3, 0)", fill: "white" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
              />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Line
                type="linear"
                dataKey={value}
                stroke={getTremorColor(color || "blue")}
                dot={false}
                strokeWidth={2}
              />
              <Bar
                dataKey="value"
                name="value"
                type="linear"
                fill={getTremorColor(color || "blue")}
              />
            </ComposedChart>
          </div>
        );
      case "scatter":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <ScatterChart width={500} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ transform: "translate(0, 6)", fill: "white" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: "translate(-3, 0)", fill: "white" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
              />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Scatter dataKey={value} fill={getTremorColor(color || "blue")} />
            </ScatterChart>
          </div>
        );
      case "pie":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            <DonutChart
              data={data}
              category={value}
              index="name"
              colors={[
                color || "cyan",
                "violet",
                "rose",
                "amber",
                "emerald",
                "teal",
                "fuchsia",
              ]}
              // No actual legend for pie chart, but this will toggle the central text
              showLabel={showLegend}
              valueFormatter={dataFormatter}
              customTooltip={customTooltip}
            />
          </div>
        );
      case "radar":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <RadarChart
              cx={300}
              cy={250}
              outerRadius={150}
              width={600}
              height={500}
              data={data}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fill: "white" }} />
              <PolarRadiusAxis tick={{ fill: "white" }} />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Radar
                dataKey="value"
                stroke={getTremorColor(color || "blue")}
                fill={getTremorColor(color || "blue")}
                fillOpacity={0.6}
              />
            </RadarChart>
          </div>
        );
      case "radialbar":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <RadialBarChart
              width={500}
              height={300}
              cx={150}
              cy={150}
              innerRadius={20}
              outerRadius={140}
              barSize={10}
              data={data}
            >
              <RadialBar
                angleAxisId={15}
                label={{
                  position: "insideStart",
                  fill: getTremorColor(color || "blue"),
                }}
                dataKey="value"
              />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
            </RadialBarChart>
          </div>
        );
      case "treemap":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <Treemap
              width={500}
              height={260}
              data={data}
              dataKey="value"
              stroke="#fff"
              fill={getTremorColor(color || "blue")}
              content={<CustomCell colors={Object.values(Colors)} />}
            >
              <Tooltip legendColor={getTremorColor(color || "blue")} />
            </Treemap>
          </div>
        );
      case "funnel":
        return (
          <div className="bg-zinc-900 p-8 rounded-xl text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || "blue", color || "blue"]}
                  className="mb-5"
                />
              </div>
            )}
            <FunnelChart width={500} height={300} data={data}>
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Funnel dataKey="value" color={getTremorColor(color || "blue")} />
            </FunnelChart>
          </div>
        );
      default:
        return <p>Unsupported chart type.</p>;
    }
  };

  if (!!props.chatId) {
    return (
      <div className="flex justify-center items-end w-full">
        <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
          <div className="flex gap-x-5">
            <WorkspaceProfileImage workspace={workspace} />
            <div className="relative w-full">
              <DownloadGraph onClick={handleDownload} />
              <div ref={ref}>{renderChart()}</div>
              <span
                className={`flex flex-col gap-y-1 mt-2`}
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(content.caption),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
        <div className="relative w-full">
          <DownloadGraph onClick={handleDownload} />
          <div ref={ref}>{renderChart()}</div>
        </div>
        <div className="flex gap-x-5">
          <span
            className={`flex flex-col gap-y-1 mt-2`}
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(content.caption),
            }}
          />
        </div>
      </div>
    </div>
  );
}

const customTooltip = (props) => {
  const { payload, active } = props;
  if (!active || !payload) return null;
  const categoryPayload = payload?.[0];
  if (!categoryPayload) return null;
  return (
    <div className="w-56 bg-zinc-400 rounded-lg border p-2 text-white">
      <div className="flex flex-1 space-x-2.5">
        <div
          className={`flex w-1.5 flex-col bg-${categoryPayload?.color}-500 rounded`}
        />
        <div className="w-full">
          <div className="flex items-center justify-between space-x-8">
            <p className="whitespace-nowrap text-right text-tremor-content">
              {categoryPayload.name}
            </p>
            <p className="whitespace-nowrap text-right font-medium text-tremor-content-emphasis">
              {categoryPayload.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function DownloadGraph({ onClick }) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return (
    <div className="absolute top-3 right-3 z-50 cursor-pointer">
      <div className="flex flex-col items-center">
        <div className="p-1 rounded-full border-none">
          {loading ? (
            <CircleNotch
              className="text-white/50 w-5 h-5 animate-spin"
              aria-label="Downloading image..."
            />
          ) : (
            <DownloadSimple
              weight="bold"
              className="text-white/50 w-5 h-5 hover:text-white"
              onClick={handleClick}
              aria-label="Download graph image"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Chartable);

```
Based on the provided TypeScript code, I'll generate comprehensive documentation for the `Chartable` component. Here it is:

**Purpose and Usage**
The `Chartable` component is designed to render various chart types (e.g., radial bar charts, treemaps, funnels) based on user input. It's intended for use within a larger codebase as a reusable component for visualizing data.

**Method Documentation**

### `renderChart()`

```typescript
function renderChart(): JSX.Element {
  // ...
}
```
Purpose: Render the chart based on the provided data and configuration options.
Return type: A JSX element representing the rendered chart.

Example:

```jsx
import React from 'react';
import { Chartable } from './Chartable';

const App = () => {
  const chartData = [...]; // Provide your chart data here

  return (
    <div>
      <Chartable
        data={chartData}
        type="radialBar" // or "treemap", "funnel"
        options={{ /* Optional configuration options */ }}
      />
    </div>
  );
};
```

### `customTooltip(props)`

```typescript
const customTooltip = (props: any): JSX.Element => {
  // ...
};
```
Purpose: Customize the tooltip behavior for each chart type.
Return type: A JSX element representing the customized tooltip.

Example:

```jsx
import React from 'react';
import { Chartable } from './Chartable';

const App = () => {
  const chartData = [...]; // Provide your chart data here

  return (
    <div>
      <Chartable
        data={chartData}
        type="radialBar" // or "treemap", "funnel"
        tooltip={customTooltip} // Use the customized tooltip for this chart
      />
    </div>
  );
};
```

### `DownloadGraph({ onClick })`

```typescript
function DownloadGraph({ onClick }: { onClick: () => void }): JSX.Element {
  // ...
}
```
Purpose: Provide a download button with optional callback functionality.
Return type: A JSX element representing the download button.

Example:

```jsx
import React from 'react';
import { Chartable } from './Chartable';

const App = () => {
  const handleClick = async () => {
    // Handle the download click event
  };

  return (
    <div>
      <Chartable
        data={...} // Provide your chart data here
        type="radialBar" // or "treemap", "funnel"
        options={{ /* Optional configuration options */ }}
        DownloadButton={<DownloadGraph onClick={handleClick} />}
      />
    </div>
  );
};
```

**Dependencies**
The `Chartable` component relies on the following dependencies:

* React: The component uses JSX syntax and is built with React.
* TypeScript: The codebase uses TypeScript for type checking and documentation.

**Examples**

Here are a few examples of how you can use the `Chartable` component in your application:

1. Render a radial bar chart:
```jsx
<Chartable data={...} type="radialBar" />
```
2. Render a treemap with customized tooltip behavior:
```jsx
import { customTooltip } from './custom-tooltip';

<Chartable
  data={...}
  type="treemap"
  options={{ /* Optional configuration options */ }}
  tooltip={customTooltip}
/>
```

Please note that this documentation assumes the `Chartable` component is used within a React application. If you're using it in a different context, please modify the examples accordingly.

I hope this comprehensive documentation helps you understand and effectively use the `Chartable` component!