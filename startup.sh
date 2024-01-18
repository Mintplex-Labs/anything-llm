#!/bin/bash

# Define the project directory
PROJECT_DIR="$HOME/anything-llm"

# Load configuration from an external file (if exists)
CONFIG_FILE="$PROJECT_DIR/startup.config"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    # Define the ports and associated services if no config file is found
    declare -A ports=( ["server"]=3001 ["collector"]=8888 ["frontend"]=3000 )
fi

# Log function with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$PROJECT_DIR/startup.log"
}

# Check for required software
check_dependencies() {
    local dependencies=(yarn lsof nohup)
    for dep in "${dependencies[@]}"; do
        if ! command -v $dep &> /dev/null; then
            log "Error: Required dependency '$dep' is not installed."
            exit 1
        fi
    done
}

# Function to check if a service is already running on a port
is_service_running() {
    local port=$1
    if lsof -i:$port > /dev/null; then
        return 0 # Service is running
    else
        return 1 # Service is not running
    fi
}

# Function to kill a process running on a given port
kill_process_on_port() {
    local port=$1
    local pid=$(lsof -t -i:$port)
    if [ -n "$pid" ]; then
        kill $pid
        sleep 2
    fi
}

# Function to start a service and log its output
start_service() {
    local command=$1
    local log_file=$2
    log "Starting $command..."
    nohup $command > "$log_file" 2>&1 &
    log "$command has been started with PID $!. Logs: $log_file"
    sleep 5
}

# Signal trapping
trap 'log "Script interrupted."; exit 1' INT TERM

# Check for required dependencies before starting
check_dependencies

# Navigate to the project directory
cd $PROJECT_DIR || { log "Error: Failed to enter project directory $PROJECT_DIR"; exit 1; }

# Set the API base URL
export API_BASE_URL="https://xlds.vercel.app"

# Count the number of services already running
services_running=0
for port in "${ports[@]}"; do
    if is_service_running $port; then
        ((services_running++))
    fi
done

# Decide the action based on the number of services running
if [ $services_running -eq 3 ]; then
    log "All services appear to be running."
    browser_warning=""
    if is_service_running 3000; then
        browser_warning=" (This will close your browser)"
    fi
    echo "1) Restart the application$browser_warning"
    echo "2) Close all services and exit$browser_warning"
    echo "3) Exit"
    read -p "Please select an option [1-3]: " user_option

    case $user_option in
        1)
            log "Terminating all services..."
            for port in "${ports[@]}"; do
                kill_process_on_port $port
            done
            ;;
        2)
            log "Closing all services and exiting."
            for port in "${ports[@]}"; do
                kill_process_on_port $port
            done
            exit 0
            ;;
        3)
            log "Exiting the script as per user request."
            exit 0
            ;;
        *)
            log "Invalid option selected. Exiting."
            exit 1
            ;;
    esac
elif [ $services_running -gt 0 ]; then
    log "Some services are already running and will be restarted."
    for port in "${ports[@]}"; do
        kill_process_on_port $port
    done
else
    log "No services are currently running. Starting all services."
fi

# Start the services
start_service "yarn dev:server" "$PROJECT_DIR/server.log"
start_service "yarn dev:collector" "$PROJECT_DIR/collector.log"
start_service "yarn dev:frontend" "$PROJECT_DIR/frontend.log"

log "All services have been started. Check the log files for output."