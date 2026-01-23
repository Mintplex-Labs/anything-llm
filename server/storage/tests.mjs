
// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

export const routeConfig = [
    {
      name: "programming",
      description:
        "Any software development task including writing code, debugging, fixing bugs, code review, performance optimization, API integration, library usage, programming questions, and general coding assistance",
    },
    {
      name: "content_summarization",
      description:
        "Summarizing articles, documents, text, papers, books, videos, meetings, or any content into concise summaries or key points",
    },
    {
      name: "medical",
      description:
        "Health-related questions, medical symptoms, diseases, treatments, medications, wellness advice, nutrition, and healthcare information",
    },
    {
      name: "legal",
      description:
        "Legal questions, contracts, regulations, laws, legal rights, compliance, legal advice, and understanding legal documents",
    },
    {
      name: "image_generation",
      description:
        "Creating, generating, or designing images, artwork, illustrations, logos, visual content, or any image-based creative requests",
    },
  ];
  
  // =============================================================================
  // PROMPT TEMPLATES
  // =============================================================================
  
  export const TASK_INSTRUCTION = `
  You are a helpful assistant designed to find the best suited route.
  You are provided with route description within <routes></routes> XML tags:
  <routes>
  
  {routes}
  
  </routes>
  
  <conversation>
  
  {conversation}
  
  </conversation>
  `;
  
  export const FORMAT_PROMPT = `
  Your task is to decide which route is best suited for the user intent in the conversation within <conversation></conversation> XML tags. Follow these instructions:
  
  1. You MUST ONLY select from the exact route names defined in <routes></routes>. Do NOT invent or create new route names.
  2. If the user's latest intent does not clearly match any route, OR if the user's intent has already been fulfilled, respond with {"route": "other"}.
  3. Analyze the route descriptions carefully and select the single best matching route for the user's latest message.
  4. Use the EXACT "name" field from the route definitions - do not paraphrase or abbreviate.
  
  Respond with ONLY a JSON object in this format:
  {"route": "route_name"}
  `;
  
  export function formatPrompt(routes, conversation) {
    return (
      TASK_INSTRUCTION.replace("{routes}", JSON.stringify(routes)).replace(
        "{conversation}",
        JSON.stringify(conversation)
      ) + FORMAT_PROMPT
    );
  }
  
  // =============================================================================
  // TEST CASES
  // =============================================================================
  
  export const testCases = [
    // -------------------------------------------------------------------------
    // PROGRAMMING - Code, debugging, APIs, optimization
    // -------------------------------------------------------------------------
    {
      name: "Programming: Bug fix request",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "I'm getting a TypeError: 'NoneType' object is not subscriptable on line 42. Here's my code:\n\ndef get_user(data):\n    return data['user']['name']\n\nCan you help me fix this?",
        },
      ],
    },
    {
      name: "Programming: Code generation",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "Write me a Python function that takes a list of numbers and returns the top 3 largest values.",
        },
      ],
    },
    {
      name: "Programming: Performance optimization",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "This function is running too slow with large datasets. How can I make it faster?\n\ndef find_duplicates(lst):\n    duplicates = []\n    for i in range(len(lst)):\n        for j in range(i+1, len(lst)):\n            if lst[i] == lst[j] and lst[i] not in duplicates:\n                duplicates.append(lst[i])\n    return duplicates",
        },
      ],
    },
    {
      name: "Programming: API integration",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "How do I authenticate with the Stripe API using Python? I need to set up payment processing.",
        },
      ],
    },
    {
      name: "Programming: General question",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "What's the difference between a stack and a queue? When would I use each one?",
        },
      ],
    },
    {
      name: "Programming: Multi-turn debugging",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "Here's my React component:\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={setCount(count + 1)}>{count}</button>;\n}",
        },
        {
          role: "assistant",
          content: "I see your Counter component. What would you like help with?",
        },
        {
          role: "user",
          content: "It's causing an infinite re-render loop. What's wrong?",
        },
      ],
    },
    {
      name: "Programming: Write unit tests",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "Write unit tests for this function:\n\ndef calculate_discount(price, discount_percent):\n    return price * (1 - discount_percent / 100)",
        },
      ],
    },
    // -------------------------------------------------------------------------
    // CONTENT SUMMARIZATION
    // -------------------------------------------------------------------------
    {
      name: "Summarization: Article summary",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "Can you summarize this article for me? [Long article about climate change and its effects on global ecosystems...]",
        },
      ],
    },
    {
      name: "Summarization: Meeting notes",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "I have these meeting notes from our product planning session. Can you give me the key takeaways and action items?\n\n[Meeting transcript about product roadmap discussion...]",
        },
      ],
    },
    {
      name: "Summarization: Research paper",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "Summarize the main findings of this research paper on machine learning approaches to protein folding.",
        },
      ],
    },
    {
      name: "Summarization: Book summary request",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "Give me a summary of 'Atomic Habits' by James Clear. What are the main concepts?",
        },
      ],
    },
    {
      name: "Summarization: Multi-turn document summary",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content: "I have a 50-page report on quarterly sales performance.",
        },
        {
          role: "assistant",
          content:
            "I'd be happy to help with your sales report. What would you like me to do with it?",
        },
        {
          role: "user",
          content:
            "Can you condense it into a one-page executive summary with the key metrics?",
        },
      ],
    },
    {
      name: "Summarization: Video transcript",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "Here's a transcript from a 2-hour podcast. Can you give me the highlights and main discussion points?",
        },
      ],
    },
    {
      name: "Summarization: TL;DR request",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "TL;DR this email thread for me - there's like 30 messages and I need to know what was decided.",
        },
      ],
    },
    // -------------------------------------------------------------------------
    // MEDICAL
    // -------------------------------------------------------------------------
    {
      name: "Medical: Symptom inquiry",
      expected: "medical",
      conversation: [
        {
          role: "user",
          content:
            "I've been having headaches for the past week, mostly in the morning. What could be causing this?",
        },
      ],
    },
    {
      name: "Medical: Medication question",
      expected: "medical",
      conversation: [
        {
          role: "user",
          content:
            "What are the side effects of ibuprofen? Is it safe to take daily?",
        },
      ],
    },
    {
      name: "Medical: Nutrition advice",
      expected: "medical",
      conversation: [
        {
          role: "user",
          content:
            "What foods are good for lowering cholesterol? I just got my blood work back and it's high.",
        },
      ],
    },
    {
      name: "Medical: Disease information",
      expected: "medical",
      conversation: [
        {
          role: "user",
          content:
            "Can you explain what type 2 diabetes is and how it differs from type 1?",
        },
      ],
    },
    {
      name: "Medical: Treatment options",
      expected: "medical",
      conversation: [
        {
          role: "user",
          content:
            "My doctor mentioned I might need physical therapy for my back pain. What does that involve?",
        },
      ],
    },
    {
      name: "Medical: Multi-turn health concern",
      expected: "medical",
      conversation: [
        { role: "user", content: "I've been feeling really tired lately." },
        {
          role: "assistant",
          content:
            "Fatigue can have many causes. How long has this been going on, and are there any other symptoms?",
        },
        {
          role: "user",
          content:
            "About two weeks. I'm also feeling cold all the time and my hair seems to be thinning. Could this be a thyroid problem?",
        },
      ],
    },
    {
      name: "Medical: Wellness question",
      expected: "medical",
      conversation: [
        {
          role: "user",
          content:
            "How much sleep should an adult get each night? I've been getting about 5 hours.",
        },
      ],
    },
    {
      name: "Medical: Mental health",
      expected: "medical",
      conversation: [
        {
          role: "user",
          content:
            "What's the difference between anxiety and depression? Can you have both?",
        },
      ],
    },
    // -------------------------------------------------------------------------
    // LEGAL
    // -------------------------------------------------------------------------
    {
      name: "Legal: Contract question",
      expected: "legal",
      conversation: [
        {
          role: "user",
          content:
            "My landlord wants to increase my rent by 30%. Is this legal? I'm in California.",
        },
      ],
    },
    {
      name: "Legal: Employment rights",
      expected: "legal",
      conversation: [
        {
          role: "user",
          content:
            "Can my employer fire me for taking sick days? I have documentation from my doctor.",
        },
      ],
    },
    {
      name: "Legal: Intellectual property",
      expected: "legal",
      conversation: [
        {
          role: "user",
          content:
            "What's the difference between a trademark and a copyright? Which one do I need for my logo?",
        },
      ],
    },
    {
      name: "Legal: Consumer rights",
      expected: "legal",
      conversation: [
        {
          role: "user",
          content:
            "I bought a laptop that broke after 2 months. The store says the warranty doesn't cover it. What are my options?",
        },
      ],
    },
    {
      name: "Legal: Privacy regulations",
      expected: "legal",
      conversation: [
        {
          role: "user",
          content:
            "What is GDPR and how does it affect my small business website?",
        },
      ],
    },
    {
      name: "Legal: Multi-turn contract review",
      expected: "legal",
      conversation: [
        {
          role: "user",
          content: "I'm about to sign a freelance contract for a software project.",
        },
        {
          role: "assistant",
          content:
            "Freelance contracts are important to review carefully. What would you like to know about it?",
        },
        {
          role: "user",
          content:
            "There's a clause that says they own all IP even for tools I create on my own time. Is this enforceable?",
        },
      ],
    },
    {
      name: "Legal: Small claims court",
      expected: "legal",
      conversation: [
        {
          role: "user",
          content:
            "Someone owes me $3000 and won't pay. How do I take them to small claims court?",
        },
      ],
    },
    // -------------------------------------------------------------------------
    // IMAGE GENERATION
    // -------------------------------------------------------------------------
    {
      name: "Image Gen: Create artwork",
      expected: "image_generation",
      conversation: [
        {
          role: "user",
          content:
            "Create an image of a futuristic city at sunset with flying cars and neon lights.",
        },
      ],
    },
    {
      name: "Image Gen: Logo design",
      expected: "image_generation",
      conversation: [
        {
          role: "user",
          content:
            "Design a logo for my coffee shop called 'Bean There'. I want something modern and minimalist.",
        },
      ],
    },
    {
      name: "Image Gen: Illustration request",
      expected: "image_generation",
      conversation: [
        {
          role: "user",
          content:
            "Can you generate an illustration of a dragon reading a book in a cozy library?",
        },
      ],
    },
    {
      name: "Image Gen: Photo manipulation concept",
      expected: "image_generation",
      conversation: [
        {
          role: "user",
          content:
            "Generate an image that looks like a photograph of a cat wearing a tiny business suit.",
        },
      ],
    },
    {
      name: "Image Gen: Multi-turn image refinement",
      expected: "image_generation",
      conversation: [
        {
          role: "user",
          content: "I need some visual content for my fantasy novel cover.",
        },
        {
          role: "assistant",
          content:
            "I'd be happy to help create imagery for your book cover. What's the theme or scene you're imagining?",
        },
        {
          role: "user",
          content:
            "Generate an image of a mystical forest with glowing mushrooms and a hidden elven city in the background.",
        },
      ],
    },
    {
      name: "Image Gen: Social media graphic",
      expected: "image_generation",
      conversation: [
        {
          role: "user",
          content:
            "Create a banner image for my Instagram announcing a summer sale. Make it colorful and eye-catching.",
        },
      ],
    },
    {
      name: "Image Gen: Character design",
      expected: "image_generation",
      conversation: [
        {
          role: "user",
          content:
            "Design a character for my video game - a steampunk inventor with mechanical arms and goggles.",
        },
      ],
    },
    {
      name: "Image Gen: Art style request",
      expected: "image_generation",
      conversation: [
        {
          role: "user",
          content:
            "Generate a portrait of a woman in the style of Van Gogh's Starry Night.",
        },
      ],
    },
    // -------------------------------------------------------------------------
    // OTHER / OFF-TOPIC
    // -------------------------------------------------------------------------
    {
      name: "Other: Simple greeting",
      expected: "other",
      conversation: [{ role: "user", content: "Hello! How are you today?" }],
    },
    {
      name: "Other: Weather question",
      expected: "other",
      conversation: [
        {
          role: "user",
          content: "What's the weather like in San Francisco today?",
        },
      ],
    },
    {
      name: "Other: Math calculation",
      expected: "other",
      conversation: [{ role: "user", content: "What's 15% of 847?" }],
    },
    {
      name: "Other: General knowledge",
      expected: "other",
      conversation: [
        {
          role: "user",
          content: "Who won the World Cup in 2022?",
        },
      ],
    },
    {
      name: "Other: Intent fulfilled",
      expected: "other",
      conversation: [
        { role: "user", content: "Write me a function to reverse a string." },
        {
          role: "assistant",
          content:
            "Here's a Python function:\n\ndef reverse_string(s):\n    return s[::-1]",
        },
        { role: "user", content: "Perfect, thanks!" },
      ],
    },
    {
      name: "Other: Recipe request",
      expected: "other",
      conversation: [
        {
          role: "user",
          content: "What's a good recipe for chocolate chip cookies?",
        },
      ],
    },
    {
      name: "Other: Travel recommendation",
      expected: "other",
      conversation: [
        {
          role: "user",
          content: "What are the best places to visit in Japan?",
        },
      ],
    },
    {
      name: "Other: Translation request",
      expected: "other",
      conversation: [
        {
          role: "user",
          content: "How do you say 'thank you' in Japanese?",
        },
      ],
    },
    // -------------------------------------------------------------------------
    // EDGE CASES - Cross-domain or ambiguous
    // -------------------------------------------------------------------------
    {
      name: "Edge: Health app code (programming, not medical)",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "Write a Python function that calculates BMI given height and weight.",
        },
      ],
    },
    {
      name: "Edge: Legal document summarization",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "Can you summarize this 20-page terms of service agreement? I just need the key points.",
        },
      ],
    },
    {
      name: "Edge: Medical research summary",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "Summarize the findings from these clinical trial results about the new diabetes medication.",
        },
      ],
    },
    {
      name: "Edge: Code for image processing (programming, not image gen)",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "Write Python code to resize an image using PIL and apply a blur filter.",
        },
      ],
    },
    {
      name: "Edge: Legal API integration (programming, not legal)",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "How do I integrate the DocuSign API to send contracts for e-signature?",
        },
      ],
    },
    {
      name: "Edge: Describe an image (not generation)",
      expected: "other",
      conversation: [
        {
          role: "user",
          content:
            "What's in this image I'm sharing? Can you describe what you see?",
        },
      ],
    },
    {
      name: "Edge: Medical coding (programming context)",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "I'm building a FHIR-compliant healthcare API. How do I structure patient resources in my Node.js backend?",
        },
      ],
    },
    {
      name: "Edge: Summarize code (programming, not summarization)",
      expected: "programming",
      conversation: [
        {
          role: "user",
          content:
            "Can you explain what this code does?\n\nconst debounce = (fn, ms) => {\n  let timeout;\n  return (...args) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn(...args), ms);\n  };\n};",
        },
      ],
    },
    // -------------------------------------------------------------------------
    // LONG MULTI-TURN CONVERSATIONS
    // -------------------------------------------------------------------------
    {
      name: "Long multi-turn: Programming after discussion",
      expected: "programming",
      conversation: [
        { role: "user", content: "I'm building a REST API with FastAPI." },
        {
          role: "assistant",
          content:
            "Great choice! FastAPI is excellent for building APIs. What do you need help with?",
        },
        {
          role: "user",
          content: "I'm not sure about the best way to structure my project.",
        },
        {
          role: "assistant",
          content:
            "A common pattern is to separate routes, models, and services. Would you like me to explain the typical structure?",
        },
        {
          role: "user",
          content:
            "Yes, and can you also write me a sample endpoint that handles file uploads?",
        },
      ],
    },
    {
      name: "Long multi-turn: Medical follow-up",
      expected: "medical",
      conversation: [
        {
          role: "user",
          content: "I've been diagnosed with high blood pressure.",
        },
        {
          role: "assistant",
          content:
            "High blood pressure is a common condition. Are you currently on any medication for it?",
        },
        { role: "user", content: "Yes, my doctor prescribed lisinopril." },
        {
          role: "assistant",
          content:
            "Lisinopril is an ACE inhibitor commonly used for blood pressure. How are you finding it so far?",
        },
        {
          role: "user",
          content:
            "I've been having a persistent dry cough. Could this be related to the medication?",
        },
      ],
    },
    {
      name: "Long multi-turn: Legal clarification",
      expected: "legal",
      conversation: [
        { role: "user", content: "I'm starting a small business." },
        {
          role: "assistant",
          content:
            "Congratulations! What type of business are you planning to start?",
        },
        { role: "user", content: "An online store selling handmade jewelry." },
        {
          role: "assistant",
          content:
            "That's exciting! Have you decided on a business structure yet - sole proprietorship, LLC, etc?",
        },
        {
          role: "user",
          content:
            "I was thinking LLC. What are the legal requirements to set one up in Texas?",
        },
      ],
    },
    {
      name: "Long multi-turn: Image generation refinement",
      expected: "image_generation",
      conversation: [
        { role: "user", content: "I need visuals for a presentation about AI." },
        {
          role: "assistant",
          content:
            "I can help with that. What kind of visuals are you looking for?",
        },
        {
          role: "user",
          content: "Something that represents machine learning in a creative way.",
        },
        {
          role: "assistant",
          content:
            "There are many creative approaches - neural network visualizations, robots, abstract data patterns. Any preference?",
        },
        {
          role: "user",
          content:
            "Generate an image of a brain made of interconnected glowing circuits with data flowing through it.",
        },
      ],
    },
    {
      name: "Long multi-turn: Summarization after context",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content: "I have a bunch of customer feedback from our survey.",
        },
        {
          role: "assistant",
          content:
            "Customer feedback is valuable. How many responses did you collect?",
        },
        {
          role: "user",
          content: "About 500 responses. Most are free-text comments.",
        },
        {
          role: "assistant",
          content:
            "That's a good sample size. What would you like to do with this feedback?",
        },
        {
          role: "user",
          content:
            "Can you summarize the main themes and identify the top complaints and praises?",
        },
      ],
    },
    // -------------------------------------------------------------------------
    // STRESS TESTS
    // -------------------------------------------------------------------------
    {
      name: "Stress: Very short medical",
      expected: "medical",
      conversation: [
        { role: "user", content: "Is aspirin safe during pregnancy?" },
      ],
    },
    {
      name: "Stress: Very short legal",
      expected: "legal",
      conversation: [{ role: "user", content: "Can I sue for defamation?" }],
    },
    {
      name: "Stress: Very short image gen",
      expected: "image_generation",
      conversation: [{ role: "user", content: "Draw me a cat" }],
    },
    {
      name: "Stress: Multiple topics (primary: summarization)",
      expected: "content_summarization",
      conversation: [
        {
          role: "user",
          content:
            "I have a long legal document about a medical malpractice case. Can you give me a quick summary of the key points?",
        },
      ],
    },
    {
      name: "Stress: Vague request",
      expected: "other",
      conversation: [{ role: "user", content: "Help me with my project" }],
    },
  ];