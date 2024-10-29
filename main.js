const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load your web application (adjust the URL if needed)
  win.loadURL('http://localhost:3001');

  // Start your Docker container in the background (adjust as necessary)
  exec('docker run -p 3001:3001 anythingllm', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Docker container: ${error.message}`);
      return;
    }
    console.log(`Docker container started: ${stdout}`);
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
