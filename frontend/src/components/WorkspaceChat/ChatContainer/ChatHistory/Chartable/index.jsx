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

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart
            className="h-[350px]"
            data={data}
            index="name"
            categories={[value]}
            colors={[color || "blue", "cyan"]}
            showLegend={showLegend}
            valueFormatter={dataFormatter}
          />
        );
      case "bar":
        return (
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
        );
      case "line":
        return (
          <LineChart
            className="h-[300px]"
            data={data}
            index="name"
            categories={[value]}
            colors={[color || "blue"]}
            showLegend={showLegend}
            valueFormatter={dataFormatter}
          />
        );
      case "composed":
        return (
          <>
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
                tick={{ transform: "translate(0, 6)" }}
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
                tick={{ transform: "translate(-3, 0)" }}
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
          </>
        );
      case "scatter":
        return (
          <>
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
                tick={{ transform: "translate(0, 6)" }}
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
                tick={{ transform: "translate(-3, 0)" }}
                style={{
                  fontSize: "12px",
                  fontFamily: "Inter; Helvetica",
                }}
              />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Scatter dataKey={value} fill={getTremorColor(color || "blue")} />
            </ScatterChart>
          </>
        );
      case "pie":
        return (
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
          />
        );
      case "radar":
        return (
          <>
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
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Tooltip legendColor={getTremorColor(color || "blue")} />
              <Radar
                dataKey="value"
                stroke={getTremorColor(color || "blue")}
                fill={getTremorColor(color || "blue")}
                fillOpacity={0.6}
              />
            </RadarChart>
          </>
        );
      case "radialbar":
        return (
          <>
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
          </>
        );
      case "treemap":
        return (
          <>
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
          </>
        );
      case "funnel":
        return (
          <>
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
          </>
        );
      default:
        return <p>Unsupported chart type.</p>;
    }
  };

  if (!!props.chatId) {
    return (
      <div className="flex justify-center items-end w-full">
        <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col">
          <div className="flex gap-x-5">
            <WorkspaceProfileImage workspace={workspace} />
            <div className="relative">
              <DownloadGraph onClick={handleDownload} />
              <div ref={ref}>{renderChart()}</div>
              <span
                className={`reply flex flex-col gap-y-1 mt-2`}
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
      <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col">
        <div className="relative">
          <DownloadGraph onClick={handleDownload} />
          <div ref={ref}>{renderChart()}</div>
        </div>
        <div className="flex gap-x-5">
          <span
            className={`reply flex flex-col gap-y-1 mt-2`}
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(content.caption),
            }}
          />
        </div>
      </div>
    </div>
  );
}

function DownloadGraph({ onClick }) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return (
    <div className="absolute top-0 right-0 z-50 cursor-pointer">
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
              className="text-white/50 w-5 h-5"
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
