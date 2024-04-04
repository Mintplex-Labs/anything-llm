const fs = require('fs')
const path = require('path')

/**
 * Plugin to save chat history to a json file
 */
function fileHistory({
  filename = `history/chat-history-${new Date().toISOString()}.json`,
} = {}) {
  return {
    name: 'file-history-plugin',
    setup(aibitat) {
      const folderPath = path.dirname(filename)
      // get path from filename
      if (folderPath) {
        fs.mkdirSync(folderPath, { recursive: true })
      }

      aibitat.onMessage(() => {
        const content = JSON.stringify(aibitat.chats, null, 2)
        fs.writeFile(filename, content, err => {
          if (err) {
            console.error(err)
          }
        })
      })
    },
  }
}

module.exports = { fileHistory }