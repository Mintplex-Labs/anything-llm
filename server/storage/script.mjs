import { fileURLToPath } from "url";
import path from "path";
import { getLlama, LlamaChatSession } from "node-llama-cpp";
import { routeConfig, formatPrompt, testCases } from "./tests.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONTEXT_SIZE = 8192;
const THREADS = 24; // Reduce from 16 to limit CPU usage

/**
 * Parse the model's response to extract the route name
 */
function parseRouteFromResponse(response) {
  try {
    // Try to parse as JSON first
    const cleaned = response.trim();

    // Handle various JSON formats the model might return
    const jsonMatch = cleaned.match(/\{[^}]*"route"\s*:\s*"([^"]+)"[^}]*\}/);
    if (jsonMatch) {
      return jsonMatch[1].toLowerCase();
    }

    // Try direct JSON parse
    const parsed = JSON.parse(cleaned);
    if (parsed.route) {
      return parsed.route.toLowerCase();
    }
  } catch (e) {
    // If JSON parsing fails, try to extract route name directly
    const match = response.match(/['"]?route['"]?\s*[:=]\s*['"]?(\w+)['"]?/i);
    if (match) {
      return match[1].toLowerCase();
    }
  }

  return response.trim().toLowerCase();
}

async function runBenchmark() {
  console.log("=".repeat(70));
  console.log("node-llama-cpp Routing Accuracy & Performance Benchmark");
  console.log("=".repeat(70));
  console.log(`Total Test Cases: ${testCases.length}`);
  console.log(`Context Size: ${CONTEXT_SIZE}`);
  console.log(`Threads: ${THREADS}`);
  console.log(`Routes: ${routeConfig.map(r => r.name).join(", ")}`);
  console.log("");

  // Load llama and model once
  console.log("Loading llama backend...");
  const llama = await getLlama({ gpu: 'auto' });

  console.log("Loading model...");
  const modelPath = path.join(
    __dirname,
    "./models",
    "hf_mradermacher_Arch-Router-1.5B.Q8_0.gguf"
  );
  const model = await llama.loadModel({ modelPath });
  console.log(`Model loaded: ${model.modelInfo?.general?.name || "Unknown"}`);
  console.log("");

  const results = [];
  let correct = 0;
  let incorrect = 0;

  const startTime = performance.now();

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const prompt = formatPrompt(routeConfig, testCase.conversation);

    console.log(`[${i + 1}/${testCases.length}] ${testCase.name}`);

    // Create fresh context for each test
    const context = await model.createContext({
      contextSize: CONTEXT_SIZE,
      sequences: 1,
      // threads: THREADS,
    });

    const sequence = context.getSequence();
    const session = new LlamaChatSession({
      contextSequence: sequence,
      autoDisposeSequence: true,
    });

    // Time the prompt
    const promptStart = performance.now();
    const response = await session.prompt(prompt);
    const promptEnd = performance.now();

    const durationMs = promptEnd - promptStart;
    const predictedRoute = parseRouteFromResponse(response);
    const expectedRoute = testCase.expected.toLowerCase();
    const isCorrect = predictedRoute === expectedRoute;

    if (isCorrect) {
      correct++;
      console.log(`  ✓ Correct: "${predictedRoute}" (${durationMs.toFixed(0)}ms)`);
    } else {
      incorrect++;
      console.log(`  ✗ Wrong: got "${predictedRoute}", expected "${expectedRoute}" (${durationMs.toFixed(0)}ms)`);
      console.log(`    Response: ${response.trim().substring(0, 100)}`);
    }

    results.push({
      name: testCase.name,
      expected: expectedRoute,
      predicted: predictedRoute,
      isCorrect,
      durationMs,
      response: response.trim(),
    });

    // Dispose context
    await context.dispose();
  }

  const totalTime = performance.now() - startTime;

  // Print summary
  console.log("");
  console.log("=".repeat(70));
  console.log("RESULTS SUMMARY");
  console.log("=".repeat(70));
  console.log("");

  // Accuracy stats
  const accuracy = (correct / testCases.length) * 100;
  console.log("ACCURACY:");
  console.log(`  Correct:   ${correct}/${testCases.length} (${accuracy.toFixed(1)}%)`);
  console.log(`  Incorrect: ${incorrect}/${testCases.length}`);
  console.log("");

  // Per-category accuracy
  const categories = {};
  for (const r of results) {
    if (!categories[r.expected]) {
      categories[r.expected] = { correct: 0, total: 0 };
    }
    categories[r.expected].total++;
    if (r.isCorrect) {
      categories[r.expected].correct++;
    }
  }

  console.log("ACCURACY BY CATEGORY:");
  for (const [cat, stats] of Object.entries(categories).sort()) {
    const catAcc = ((stats.correct / stats.total) * 100).toFixed(1);
    const bar = "█".repeat(Math.round(stats.correct / stats.total * 20));
    console.log(`  ${cat.padEnd(25)} ${stats.correct}/${stats.total} (${catAcc}%) ${bar}`);
  }
  console.log("");

  // Performance stats
  const durations = results.map(r => r.durationMs);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  console.log("PERFORMANCE:");
  console.log(`  Total time:     ${(totalTime / 1000).toFixed(1)}s`);
  console.log(`  Avg per test:   ${avgDuration.toFixed(0)}ms`);
  console.log(`  Min:            ${minDuration.toFixed(0)}ms`);
  console.log(`  Max:            ${maxDuration.toFixed(0)}ms`);
  console.log(`  Throughput:     ${(testCases.length / (totalTime / 1000)).toFixed(2)} tests/sec`);
  console.log("");

  // List failures
  const failures = results.filter(r => !r.isCorrect);
  if (failures.length > 0) {
    console.log("FAILURES:");
    for (const f of failures) {
      console.log(`  - ${f.name}`);
      console.log(`    Expected: ${f.expected}, Got: ${f.predicted}`);
    }
    console.log("");
  }

  // Cleanup
  await model.dispose();
  console.log("Benchmark complete.");
}

runBenchmark().catch(console.error);
