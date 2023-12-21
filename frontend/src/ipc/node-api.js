import { ipcRenderer } from 'electron';
import { READY_EVENT_NAME, _API_BASE_URL } from '@/utils/constants';
import { API_BASE } from '@/utils/api';
import System from '@/models/system';

ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Received Main-process message]:', ...args)
})

ipcRenderer.on('backend-server-online', async (_evt, message) => {
  console.log('[Received backend-server-online message]:', message)
  _API_BASE_URL.value = message.API_BASE
  Object.freeze(_API_BASE_URL)

  let polling = true;
  while (polling) {
    console.log('Polling for server...')
    const online = await System.ping();
    polling = !online;
    await new Promise(r => setTimeout(r, 1_000));
  }

  const readyEvent = new CustomEvent(READY_EVENT_NAME, { detail: message.API_BASE });
  window.dispatchEvent(readyEvent)
  // postMessage({ payload: 'removeLoading' }, '*')
  API_BASE()
})

