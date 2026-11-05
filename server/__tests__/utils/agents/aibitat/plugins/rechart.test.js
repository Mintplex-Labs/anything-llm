const {
  rechart,
} = require("../../../../../utils/agents/aibitat/plugins/rechart");

const EXPECTED = [
  { name: "Q1", value: 12 },
  { name: "Q2", value: 30 },
];

async function createChart(dataset) {
  let definition = null;
  const sent = [];
  const aibitat = {
    function: (fn) => (definition = fn),
    introspect: () => {},
    handlerProps: { log: () => {} },
    socket: { send: (type, payload) => sent.push(payload) },
  };
  rechart.plugin().setup(aibitat);
  const result = await definition.handler({
    type: "bar",
    title: "Sales",
    dataset,
  });
  const stored = JSON.parse(aibitat._replySpecialAttributes.storedResponse());
  return { result, shown: sent[0]?.dataset, stored: stored.dataset };
}

describe("create-chart dataset", () => {
  it("sends and stores the repaired JSON the UI can parse", async () => {
    const { shown, stored } = await createChart(
      `[{name: "Q1", value: 12}, {name: "Q2", value: 30},]`
    );
    expect(JSON.parse(shown)).toEqual(EXPECTED);
    expect(JSON.parse(stored)).toEqual(EXPECTED);
  });

  it("accepts a dataset passed as an array", async () => {
    const { result, shown } = await createChart(EXPECTED);
    expect(result).toMatch(/chart was generated/);
    expect(JSON.parse(shown)).toEqual(EXPECTED);
  });
});
