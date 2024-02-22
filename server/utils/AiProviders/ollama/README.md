# Common Issues with Ollama

If you encounter an error stating `llama:streaming - could not stream chat. Error: connect ECONNREFUSED 172.17.0.1:11434` when using AnythingLLM in a Docker container, this indicates that the IP of the Host inside of the virtual docker network does not bind to port 11434 of the host system by default, due to Ollama's restriction to localhost and 127.0.0.1. To resolve this issue and ensure proper communication between the Dockerized AnythingLLM and the Ollama service, you must configure Ollama to bind to 0.0.0.0 or a specific IP address.

### Setting Environment Variables on Mac

If Ollama is run as a macOS application, environment variables should be set using `launchctl`:

1.  For each environment variable, call `launchctl setenv`.
    ```bash
    launchctl setenv OLLAMA_HOST "0.0.0.0"
    ```
2.  Restart the Ollama application.

### Setting Environment Variables on Linux

If Ollama is run as a systemd service, environment variables should be set using `systemctl`:

1.  Edit the systemd service by calling `systemctl edit ollama.service`. This will open an editor.
2.  For each environment variable, add a line `Environment` under the section `[Service]`:
    ```ini
    [Service]
    Environment="OLLAMA_HOST=0.0.0.0"
    ```
3.  Save and exit.
4.  Reload `systemd` and restart Ollama:
    ```bash
    systemctl daemon-reload
    systemctl restart ollama
    ```

### Setting Environment Variables on Windows

On Windows, Ollama inherits your user and system environment variables.

1.  First, quit Ollama by clicking on it in the taskbar.
2.  Edit system environment variables from the Control Panel.
3.  Edit or create new variable(s) for your user account for `OLLAMA_HOST`, `OLLAMA_MODELS`, etc.
4.  Click OK/Apply to save.
5.  Run `ollama` from a new terminal window.
