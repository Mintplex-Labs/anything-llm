// Plugin CAN ONLY BE USE IN DEVELOPMENT.
const { input } = require("@inquirer/prompts");
const chalk = require("chalk");
const { RetryError } = require("../error");

/**
 * Command-line Interface plugin. It prints the messages on the console and asks for feedback
 * while the conversation is running in the background.
 */
const cli = {
  name: "cli",
  startupConfig: {
    params: {},
  },
  plugin: function ({ simulateStream = true } = {}) {
    return {
      name: this.name,
      setup(aibitat) {
        let printing = [];

        aibitat.onError(async (error) => {
          console.error(chalk.red(`   error: ${error?.message}`));
          if (error instanceof RetryError) {
            console.error(chalk.red(`   retrying in 60 seconds...`));
            setTimeout(() => {
              aibitat.retry();
            }, 60000);
            return;
          }
        });

        aibitat.onStart(() => {
          console.log();
          console.log("🚀 starting chat ...\n");
          printing = [Promise.resolve()];
        });

        aibitat.onMessage(async (message) => {
          const next = new Promise(async (resolve) => {
            await Promise.all(printing);
            await this.print(message, simulateStream);
            resolve();
          });
          printing.push(next);
        });

        aibitat.onTerminate(async () => {
          await Promise.all(printing);
          console.log("🚀 chat finished");
        });

        aibitat.onInterrupt(async (node) => {
          await Promise.all(printing);
          const feedback = await this.askForFeedback(node);
          // Add an extra line after the message
          console.log();

          if (feedback === "exit") {
            console.log("🚀 chat finished");
            return process.exit(0);
          }

          await aibitat.continue(feedback);
        });
      },

      /**
   * Print a message on the terminal
   *
   * @param message
   * // message Type { from: string; to: string; content?: string } & {
      state: 'loading' | 'error' | 'success' | 'interrupt'
    }
   * @param simulateStream
   */
      print: async function (message = {}, simulateStream = true) {
        const replying = chalk.dim(`(to ${message.to})`);
        const reference = `${chalk.magenta("✎")} ${chalk.bold(
          message.from
        )} ${replying}:`;

        if (!simulateStream) {
          console.log(reference);
          console.log(message.content);
          // Add an extra line after the message
          console.log();
          return;
        }

        process.stdout.write(`${reference}\n`);

        // Emulate streaming by breaking the cached response into chunks
        const chunks = message.content?.split(" ") || [];
        const stream = new ReadableStream({
          async start(controller) {
            for (const chunk of chunks) {
              const bytes = new TextEncoder().encode(chunk + " ");
              controller.enqueue(bytes);
              await new Promise((r) =>
                setTimeout(
                  r,
                  // get a random number between 10ms and 50ms to simulate a random delay
                  Math.floor(Math.random() * 40) + 10
                )
              );
            }
            controller.close();
          },
        });

        // Stream the response to the chat
        for await (const chunk of stream) {
          process.stdout.write(new TextDecoder().decode(chunk));
        }

        // Add an extra line after the message
        console.log();
        console.log();
      },

      /**
       * Ask for feedback to the user using the terminal
       *
       * @param node //{ from: string; to: string }
       * @returns
       */
      askForFeedback: function (node = {}) {
        return input({
          message: `Provide feedback to ${chalk.yellow(
            node.to
          )} as ${chalk.yellow(
            node.from
          )}. Press enter to skip and use auto-reply, or type 'exit' to end the conversation: `,
        });
      },
    };
  },
};

module.exports = { cli };
