// Locations that serve Gemini models on the Vertex AI OpenAI-compatible
// endpoint. `global` is Google's recommended default and routes to the
// nearest available capacity - regional codes pin data processing to that
// region for residency requirements.
// Source: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/locations
export const VERTEX_REGIONS = [
  {
    name: "Global",
    full_name: "Global (recommended)",
    code: "global",
  },
  {
    name: "Iowa",
    full_name: "US Central (Iowa)",
    code: "us-central1",
  },
  {
    name: "S. Carolina",
    full_name: "US East (South Carolina)",
    code: "us-east1",
  },
  {
    name: "N. Virginia",
    full_name: "US East (N. Virginia)",
    code: "us-east4",
  },
  {
    name: "Columbus",
    full_name: "US East (Columbus)",
    code: "us-east5",
  },
  {
    name: "Dallas",
    full_name: "US South (Dallas)",
    code: "us-south1",
  },
  {
    name: "Oregon",
    full_name: "US West (Oregon)",
    code: "us-west1",
  },
  {
    name: "Las Vegas",
    full_name: "US West (Las Vegas)",
    code: "us-west4",
  },
  {
    name: "Montréal",
    full_name: "Canada (Montréal)",
    code: "northamerica-northeast1",
  },
  {
    name: "São Paulo",
    full_name: "South America (São Paulo)",
    code: "southamerica-east1",
  },
  {
    name: "Belgium",
    full_name: "Europe West (Belgium)",
    code: "europe-west1",
  },
  {
    name: "London",
    full_name: "Europe West (London)",
    code: "europe-west2",
  },
  {
    name: "Frankfurt",
    full_name: "Europe West (Frankfurt)",
    code: "europe-west3",
  },
  {
    name: "Netherlands",
    full_name: "Europe West (Netherlands)",
    code: "europe-west4",
  },
  {
    name: "Zurich",
    full_name: "Europe West (Zurich)",
    code: "europe-west6",
  },
  {
    name: "Paris",
    full_name: "Europe West (Paris)",
    code: "europe-west9",
  },
  {
    name: "Finland",
    full_name: "Europe North (Finland)",
    code: "europe-north1",
  },
  {
    name: "Warsaw",
    full_name: "Europe Central (Warsaw)",
    code: "europe-central2",
  },
  {
    name: "Madrid",
    full_name: "Europe Southwest (Madrid)",
    code: "europe-southwest1",
  },
  {
    name: "Taiwan",
    full_name: "Asia East (Taiwan)",
    code: "asia-east1",
  },
  {
    name: "Hong Kong",
    full_name: "Asia East (Hong Kong)",
    code: "asia-east2",
  },
  {
    name: "Tokyo",
    full_name: "Asia Northeast (Tokyo)",
    code: "asia-northeast1",
  },
  {
    name: "Seoul",
    full_name: "Asia Northeast (Seoul)",
    code: "asia-northeast3",
  },
  {
    name: "Mumbai",
    full_name: "Asia South (Mumbai)",
    code: "asia-south1",
  },
  {
    name: "Singapore",
    full_name: "Asia Southeast (Singapore)",
    code: "asia-southeast1",
  },
  {
    name: "Sydney",
    full_name: "Australia (Sydney)",
    code: "australia-southeast1",
  },
  {
    name: "Doha",
    full_name: "Middle East (Doha)",
    code: "me-central1",
  },
  {
    name: "Dammam",
    full_name: "Middle East (Dammam)",
    code: "me-central2",
  },
  {
    name: "Tel Aviv",
    full_name: "Middle East (Tel Aviv)",
    code: "me-west1",
  },
];
