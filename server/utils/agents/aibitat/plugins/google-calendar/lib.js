const { SystemSettings } = require("../../../../../models/systemSettings");
const { safeJsonParse } = require("../../../../http");

/**
 * Google Calendar Bridge Library
 * Handles communication with the AnythingLLM Google Calendar Google Apps Script deployment.
 */
class GoogleCalendarBridge {
  #deploymentId = null;
  #apiKey = null;
  #isInitialized = false;

  #log(text, ...args) {
    console.log(`\x1b[35m[GoogleCalendarBridge]\x1b[0m ${text}`, ...args);
  }

  /**
   * Resets the bridge state, forcing re-initialization on next use.
   * Call this when configuration changes (e.g., deployment ID updated).
   */
  reset() {
    this.#deploymentId = null;
    this.#apiKey = null;
    this.#isInitialized = false;
  }

  /**
   * Gets the current Google Calendar agent configuration from system settings.
   * @returns {Promise<{deploymentId?: string, apiKey?: string}>}
   */
  static async getConfig() {
    const configJson = await SystemSettings.getValueOrFallback(
      { label: "google_calendar_agent_config" },
      "{}"
    );
    return safeJsonParse(configJson, {});
  }

  /**
   * Updates the Google Calendar agent configuration in system settings.
   * @param {Object} updates - Fields to update
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async updateConfig(updates) {
    try {
      await SystemSettings.updateSettings({
        google_calendar_agent_config: JSON.stringify(updates),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Initializes the Google Calendar bridge by fetching configuration from system settings.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async initialize() {
    if (this.#isInitialized) return { success: true };

    try {
      const isMultiUser = await SystemSettings.isMultiUserMode();
      if (isMultiUser) {
        return {
          success: false,
          error:
            "Google Calendar integration is not available in multi-user mode for security reasons.",
        };
      }

      const config = await GoogleCalendarBridge.getConfig();
      if (!config.deploymentId || !config.apiKey) {
        return {
          success: false,
          error:
            "Google Calendar integration is not configured. Please set the Deployment ID and API Key in the agent settings.",
        };
      }

      this.#deploymentId = config.deploymentId;
      this.#apiKey = config.apiKey;
      this.#isInitialized = true;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Checks if the Google Calendar bridge is properly configured and available.
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    const result = await this.initialize();
    return result.success;
  }

  /**
   * Checks if Google Calendar tools are available (not in multi-user mode and has configuration).
   * @returns {Promise<boolean>}
   */
  static async isToolAvailable() {
    const isMultiUser = await SystemSettings.isMultiUserMode();
    if (isMultiUser) return false;

    const config = await GoogleCalendarBridge.getConfig();
    return !!(config.deploymentId && config.apiKey);
  }

  get maskedDeploymentId() {
    if (!this.#deploymentId) return "(not configured)";
    return (
      this.#deploymentId.substring(0, 5) +
      "..." +
      this.#deploymentId.substring(this.#deploymentId.length - 5)
    );
  }

  /**
   * Gets the base URL for the Google Calendar Google Apps Script deployment.
   * @returns {string}
   */
  #getBaseUrl() {
    this.#log(`Getting base URL for deployment ID ${this.maskedDeploymentId}`);
    return `https://script.google.com/macros/s/${this.#deploymentId}/exec`;
  }

  /**
   * Makes a request to the Google Calendar Google Apps Script API.
   * @param {string} action - The action to perform
   * @param {object} params - Additional parameters for the action
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async request(action, params = {}) {
    const initResult = await this.initialize();
    if (!initResult.success) {
      return { success: false, error: initResult.error };
    }

    try {
      const response = await fetch(this.#getBaseUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AnythingLLM-UA": "AnythingLLM-GoogleCalendar-Agent/1.0",
        },
        body: JSON.stringify({
          key: this.#apiKey,
          action,
          ...params,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Google Calendar API request failed with status ${response.status}`,
        };
      }

      const result = await response.json();

      if (result.status === "error") {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      return {
        success: false,
        error: `Google Calendar API request failed: ${error.message}`,
      };
    }
  }

  /**
   * List all calendars the user owns or is subscribed to.
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async listCalendars() {
    return this.request("list_calendars");
  }

  /**
   * Get details of a specific calendar by ID.
   * @param {string} calendarId - The calendar ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getCalendar(calendarId) {
    return this.request("get_calendar", { calendarId });
  }

  /**
   * Get a single event by ID.
   * @param {string} eventId - The event ID
   * @param {string} calendarId - Optional calendar ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getEvent(eventId, calendarId) {
    return this.request("get_event", { eventId, calendarId });
  }

  /**
   * Get all events for a specific day.
   * @param {string} date - ISO date string
   * @param {string} calendarId - Optional calendar ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getEventsForDay(date, calendarId) {
    return this.request("get_events_for_day", { date, calendarId });
  }

  /**
   * Get events within a date range, optionally filtered by search query.
   * @param {string} startDate - ISO datetime string
   * @param {string} endDate - ISO datetime string
   * @param {string} calendarId - Optional calendar ID
   * @param {string} query - Optional search query
   * @param {number} limit - Max results (default 25, max 100)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async getEvents(startDate, endDate, calendarId, query, limit = 25) {
    return this.request("get_events", {
      startDate,
      endDate,
      calendarId,
      query,
      limit,
    });
  }

  /**
   * Create event from natural language description.
   * @param {string} description - Natural language description
   * @param {string} calendarId - Optional calendar ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async quickAdd(description, calendarId) {
    return this.request("quick_add", { description, calendarId });
  }

  /**
   * Create a single or recurring event (timed or all-day).
   * @param {object} eventData - Event creation data
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async createEvent(eventData) {
    return this.request("create_event", eventData);
  }

  /**
   * Update an existing event.
   * @param {string} eventId - The event ID
   * @param {string} calendarId - Optional calendar ID
   * @param {object} updates - Fields to update
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async updateEvent(eventId, calendarId, updates) {
    return this.request("update_event", {
      eventId,
      calendarId,
      ...updates,
    });
  }

  /**
   * Set your RSVP status for an event.
   * @param {string} eventId - The event ID
   * @param {string} status - RSVP status: "YES", "NO", "MAYBE", or "INVITED"
   * @param {string} calendarId - Optional calendar ID
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async setMyStatus(eventId, status, calendarId) {
    return this.request("set_my_status", { eventId, status, calendarId });
  }

  /**
   * Get API version and available actions.
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async version() {
    return this.request("version");
  }
}

module.exports = new GoogleCalendarBridge();
module.exports.GoogleCalendarBridge = GoogleCalendarBridge;
