import { fileURLToPath } from "url";
import path from "path";
import { writeFile } from "fs/promises";
import { routeConfig, testCases, formatPrompt } from "./tests.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// OLLAMA API CONFIGURATION
// =============================================================================

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "router";

// =============================================================================
// OLLAMA API CALLS
// =============================================================================

async function callOllama(messages, maxTokens = 128) {
  const payload = {
    model: OLLAMA_MODEL,
    messages,
    stream: false,
    options: {
      num_predict: maxTokens,
      // Match llama-cpp-python chat completion defaults
      temperature: 0.2,
      top_p: 0.95,
      top_k: 40,
      min_p: 0.05,
      repeat_penalty: 1.0,
    },
  };

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return result.message.content;
}

// =============================================================================
// INFERENCE AND EVALUATION
// =============================================================================

function parseRouteFromResponse(responseText) {
  // Strip markdown code blocks if present (e.g., ```json\n{...}\n```)
  let cleaned = responseText.replace(/```(?:json)?\s*/g, "").trim();

  // Try to extract JSON object from response
  const jsonMatch = cleaned.match(/\{[^}]+\}/);
  if (!jsonMatch) {
    return `PARSE_ERROR: No JSON found in: ${responseText}`;
  }

  let jsonStr = jsonMatch[0];
  try {
    const parsed = JSON.parse(jsonStr);
    // Accept both "route" and "route_name" keys (model sometimes deviates)
    return parsed.route || parsed.route_name || `PARSE_ERROR: Missing route key in: ${jsonStr}`;
  } catch {
    // Try replacing single quotes with double quotes
    try {
      jsonStr = jsonStr.replace(/'/g, '"');
      const parsed = JSON.parse(jsonStr);
      return parsed.route || parsed.route_name || `PARSE_ERROR: Missing route key in: ${jsonStr}`;
    } catch {
      return `PARSE_ERROR: Invalid JSON: ${jsonStr}`;
    }
  }
}

async function runInference(conversation) {
  const routePrompt = formatPrompt(routeConfig, conversation);

  const messages = [{ role: "user", content: routePrompt }];

  const startTime = performance.now();
  const responseText = await callOllama(messages);
  const inferenceTime = (performance.now() - startTime) / 1000;

  const route = parseRouteFromResponse(responseText);

  return {
    response: responseText.trim(),
    route,
    inferenceTime,
  };
}

function calculateStats(results) {
  const correct = results.filter((r) => r.match).length;
  const total = results.length;
  const accuracy = (correct / total) * 100;

  // Accuracy by route
  const routeStats = {};
  for (const r of results) {
    if (!routeStats[r.expected]) {
      routeStats[r.expected] = { correct: 0, total: 0 };
    }
    routeStats[r.expected].total++;
    if (r.match) {
      routeStats[r.expected].correct++;
    }
  }

  // Timing stats
  const times = results.map((r) => r.inferenceTimeSeconds);
  const timing = {
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
  };

  // Timing by conversation length
  const timingByTurns = {};
  for (const r of results) {
    const turns = r.numTurns;
    if (!timingByTurns[turns]) {
      timingByTurns[turns] = [];
    }
    timingByTurns[turns].push(r.inferenceTimeSeconds);
  }

  return { correct, total, accuracy, routeStats, timing, timingByTurns };
}

function printSummary(results, totalEvalTime) {
  const stats = calculateStats(results);

  console.log("\n" + "=".repeat(80));
  console.log("SUMMARY");
  console.log("=".repeat(80));
  console.log(`Accuracy: ${stats.correct}/${stats.total} (${stats.accuracy.toFixed(1)}%)`);

  console.log("\nAccuracy by route:");
  for (const [route, data] of Object.entries(stats.routeStats).sort()) {
    const pct = (data.correct / data.total) * 100;
    console.log(`  ${route}: ${data.correct}/${data.total} (${pct.toFixed(1)}%)`);
  }

  console.log("\nTiming:");
  console.log(`  Total evaluation time: ${totalEvalTime.toFixed(2)}s`);
  console.log(`  Avg inference time:    ${stats.timing.avg.toFixed(3)}s`);
  console.log(`  Min inference time:    ${stats.timing.min.toFixed(3)}s`);
  console.log(`  Max inference time:    ${stats.timing.max.toFixed(3)}s`);

  console.log("\nTiming by conversation length:");
  for (const turns of Object.keys(stats.timingByTurns).sort((a, b) => a - b)) {
    const times = stats.timingByTurns[turns];
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`  ${turns} turn(s): avg ${avg.toFixed(3)}s (n=${times.length})`);
  }

  console.log("\nResults by test:");
  for (const r of results) {
    const status = r.match ? "OK" : "FAIL";
    console.log(
      `  ${status} ${r.name}: expected=${r.expected}, got=${r.actual} (${r.inferenceTimeSeconds.toFixed(3)}s)`
    );
  }

  // Mismatches
  const mismatches = results.filter((r) => !r.match);
  if (mismatches.length > 0) {
    console.log(`\nMismatches (${mismatches.length}):`);
    for (const r of mismatches) {
      console.log(`  - ${r.name}`);
      console.log(`    Expected: ${r.expected}`);
      console.log(`    Got: ${r.actual}`);
      console.log(`    Raw: ${r.rawResponse}`);
    }
  }
}

async function saveResults(results, timestamp, totalEvalTime) {
  const stats = calculateStats(results);

  const outputData = {
    timestamp,
    model: OLLAMA_MODEL,
    runtime: "ollama",
    ollamaBaseUrl: OLLAMA_BASE_URL,
    routeConfig,
    accuracy: stats.accuracy,
    correct: stats.correct,
    total: stats.total,
    accuracyByRoute: Object.fromEntries(
      Object.entries(stats.routeStats).map(([k, v]) => [
        k,
        {
          correct: v.correct,
          total: v.total,
          accuracy: (v.correct / v.total) * 100,
        },
      ])
    ),
    timing: {
      totalEvaluationTimeSeconds: Math.round(totalEvalTime * 10000) / 10000,
      avgInferenceTimeSeconds: Math.round(stats.timing.avg * 10000) / 10000,
      minInferenceTimeSeconds: Math.round(stats.timing.min * 10000) / 10000,
      maxInferenceTimeSeconds: Math.round(stats.timing.max * 10000) / 10000,
    },
    results,
  };

  const filename = `eval_results_ollama_${timestamp.replace(/[:.]/g, "-").replace("T", "_").split(".")[0]}.json`;
  await writeFile(filename, JSON.stringify(outputData, null, 2));
  console.log(`\nResults saved to: ${filename}`);
}

async function runEvaluation() {
  console.log("=".repeat(80));
  console.log("Connecting to Ollama...");
  console.log(`  URL: ${OLLAMA_BASE_URL}`);
  console.log(`  Model: ${OLLAMA_MODEL}`);
  console.log("=".repeat(80));

  // Test connection
  try {
    const testResponse = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!testResponse.ok) {
      throw new Error(`Failed to connect: ${testResponse.status}`);
    }
    const models = await testResponse.json();
    const modelNames = models.models?.map((m) => m.name) || [];
    if (!modelNames.some((name) => name.startsWith(OLLAMA_MODEL))) {
      console.warn(`\nWarning: Model "${OLLAMA_MODEL}" not found in Ollama.`);
      console.warn(`Available models: ${modelNames.join(", ") || "none"}`);
      console.warn(`You may need to run: ollama create ${OLLAMA_MODEL} -f <modelfile>\n`);
    } else {
      console.log("Connected to Ollama!\n");
    }
  } catch (error) {
    console.error(`\nError connecting to Ollama at ${OLLAMA_BASE_URL}:`);
    console.error(error.message);
    console.error("\nMake sure Ollama is running: ollama serve");
    process.exit(1);
  }

  const results = [];
  const evalStartTime = performance.now();
  const timestamp = new Date().toISOString();

  console.log("=".repeat(80));
  console.log(`ARCH-ROUTER EVALUATION (Ollama) - ${timestamp}`);
  console.log("=".repeat(80));
  console.log();
  console.log("Routes configured:");
  for (const route of routeConfig) {
    console.log(`  - ${route.name}: ${route.description.slice(0, 60)}...`);
  }
  console.log();

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    console.log(`[${i + 1}/${testCases.length}] ${test.name}`);
    console.log("-".repeat(60));

    // Show conversation
    console.log("Conversation:");
    for (const msg of test.conversation) {
      const role = msg.role.toUpperCase();
      const content =
        msg.content.length > 100
          ? msg.content.slice(0, 100) + "..."
          : msg.content;
      console.log(`  ${role}: ${content}`);
    }

    // Run inference
    console.log("\nRunning inference...");
    const { response, route, inferenceTime } = await runInference(test.conversation);

    const match = route === test.expected;
    const symbol = match ? "OK" : "FAIL";

    console.log(`\nExpected: ${test.expected}`);
    console.log(`Got:      ${route} ${symbol}`);
    console.log(`Raw:      ${response}`);
    console.log(`Time:     ${inferenceTime.toFixed(3)}s`);
    console.log();

    results.push({
      name: test.name,
      conversation: test.conversation,
      numTurns: test.conversation.length,
      expected: test.expected,
      actual: route,
      rawResponse: response,
      match,
      inferenceTimeSeconds: Math.round(inferenceTime * 10000) / 10000,
    });
  }

  const totalEvalTime = (performance.now() - evalStartTime) / 1000;

  printSummary(results, totalEvalTime);
  await saveResults(results, timestamp, totalEvalTime);
}

// Run evaluation
runEvaluation().catch(console.error);
