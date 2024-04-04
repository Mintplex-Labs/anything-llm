const chalk = require('chalk')
const { RetryError } = require('../error')

const SOCKET_TIMEOUT_MS = 300 * 1_000;

/**
 * Websocket Interface plugin. It prints the messages on the console and asks for feedback
 * while the conversation is running in the background.
 */

// export interface AbitatWebSocket extends ServerWebSocket<unknown> {
//   askForFeedback?: any
//   awaitResponse?: any
//   handleFeedback?: (message: string) => void;
// }

function websocket({
  socket, // @type AbitatWebSocket
}) {
  return {
    name: 'websocket',
    setup(aibitat) {
      aibitat.onError(async error => {
        console.error(chalk.red(`   error: ${error?.message}`))
        if (error instanceof RetryError) {
          console.error(chalk.red(`   retrying in 60 seconds...`))
          setTimeout(() => {
            aibitat.retry()
          }, 60000)
          return
        }
      })

      aibitat.onStart(() => {
        console.log('🚀 starting chat ...')
      })

      aibitat.onMessage(message => {
        socket.send(JSON.stringify(message))
      })

      aibitat.onTerminate(async () => {
        console.log('🚀 chat finished')
      })

      aibitat.onInterrupt(async node => {
        const feedback = await socket.askForFeedback(socket, node)
        if (feedback === 'exit') {
          console.log('🚀 chat finished')
          return process.exit(0)
        }

        await aibitat.continue(feedback)
      })

      /**
       * Socket wait for feedback on socket
       *
       * @param socket The content to summarize. // AbitatWebSocket & { receive: any, echo: any }
       * @param node The chat node // { from: string; to: string }
       * @returns The summarized content.
       */
      socket.askForFeedback = (socket, node) => {
        socket.awaitResponse = (question = 'waiting...') => {
          socket.send(JSON.stringify({ type: "AWAITING_FEEDBACK", question }));

          return new Promise(function (resolve) {
            socket.handleFeedback = (message) => {
              const data = JSON.parse(message);
              if (data.type !== 'FEEDBACK') return;
              delete socket.handleFeedback;
              resolve(data.feedback);
              return;
            };

            setTimeout(() => {
              console.log(chalk.red(`Client took too long to respond, chat thread is dead after ${SOCKET_TIMEOUT_MS}ms`))
              resolve('exit');
              return;
            }, SOCKET_TIMEOUT_MS)
          });
        }

        return socket.awaitResponse(`Provide feedback to ${chalk.yellow(node.to)} as ${chalk.yellow(node.from)}.
         Press enter to skip and use auto-reply, or type 'exit' to end the conversation: \n`
        );
      }

      console.log('🚀 WS plugin is complete.')
    },
  }
}


module.exports = {
  websocket
}