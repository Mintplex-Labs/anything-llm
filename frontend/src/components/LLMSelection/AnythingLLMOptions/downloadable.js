export const DOWNLOADABLE_MODELS = [
  {
    id: "llama2:latest",
    name: "Llama2 7B",
    description:
      "Llama 2 is released by Meta Platforms, Inc. This model is trained on 2 trillion tokens, and by default supports a context length of 4096. Llama 2 Chat models are fine-tuned on over 1 million human annotations, and are made for chat.",
    size: "3.8GB",
    link: "https://llama.meta.com/",
    licenses: [
      {
        title: "Llama 2 Acceptable Use Policy",
        link: "https://ollama.com/library/llama2-uncensored/blobs/sha256:7c23fb36d80141c4ab8cdbb61ee4790102ebd2bf7aeff414453177d4f2110e5d",
      },
      {
        title: "LLAMA 2 COMMUNITY LICENSE AGREEMENT",
        link: "https://ollama.com/library/llama2-uncensored/blobs/sha256:8c17c2ebb0ea011be9981cc3922db8ca8fa61e828c5d3f44cb6ae342bf80460b",
      },
    ],
  },
  {
    id: "llama2-uncensored:latest",
    name: "Llama2 7B (Uncensored)",
    description:
      "Llama 2 Uncensored is based on Meta's Llama 2 model, and was created by George Sung and Jarrad Hope using the process defined by Eric Hartford.",
    size: "3.8GB",
    link: "https://erichartford.com/uncensored-models",
    licenses: [
      {
        title: "Llama 2 Acceptable Use Policy",
        link: "https://ollama.com/library/llama2-uncensored/blobs/sha256:7c23fb36d80141c4ab8cdbb61ee4790102ebd2bf7aeff414453177d4f2110e5d",
      },
      {
        title: "LLAMA 2 COMMUNITY LICENSE AGREEMENT",
        link: "https://ollama.com/library/llama2-uncensored/blobs/sha256:8c17c2ebb0ea011be9981cc3922db8ca8fa61e828c5d3f44cb6ae342bf80460b",
      },
    ],
  },
  {
    id: "llama2:13b",
    name: "Llama2 13B",
    description:
      "Llama 2 is released by Meta Platforms, Inc. This model is trained on 2 trillion tokens, and by default supports a context length of 4096. Llama 2 Chat models are fine-tuned on over 1 million human annotations, and are made for chat.",
    size: "7.4GB",
    link: "https://llama.meta.com/",
    licenses: [
      {
        title: "Llama 2 Acceptable Use Policy",
        link: "https://ollama.com/library/llama2-uncensored/blobs/sha256:7c23fb36d80141c4ab8cdbb61ee4790102ebd2bf7aeff414453177d4f2110e5d",
      },
      {
        title: "LLAMA 2 COMMUNITY LICENSE AGREEMENT",
        link: "https://ollama.com/library/llama2-uncensored/blobs/sha256:8c17c2ebb0ea011be9981cc3922db8ca8fa61e828c5d3f44cb6ae342bf80460b",
      },
    ],
  },
  {
    id: "codellama:7b",
    name: "CodeLlama 7B",
    description:
      "A large language model that can use text prompts to generate and discuss code.",
    size: "3.8GB",
    link: "https://llama.meta.com/",
    licenses: [
      {
        title: "Llama 2 Acceptable Use Policy",
        link: "https://ollama.com/library/llama2-uncensored/blobs/sha256:7c23fb36d80141c4ab8cdbb61ee4790102ebd2bf7aeff414453177d4f2110e5d",
      },
      {
        title: "LLAMA 2 COMMUNITY LICENSE AGREEMENT",
        link: "https://ollama.com/library/llama2-uncensored/blobs/sha256:8c17c2ebb0ea011be9981cc3922db8ca8fa61e828c5d3f44cb6ae342bf80460b",
      },
    ],
  },
  {
    id: "mistral:latest",
    name: "Mistral 7B",
    description:
      "Mistral 7B is an LLM that outperforms Llama-2 7B on many benchmarks and is open-weight and uncensored.",
    size: "4.1GB",
    link: "https://mistral.ai/",
    licenses: [
      {
        title: "Apache 2.0",
        link: "https://choosealicense.com/licenses/apache-2.0/",
      },
    ],
  },
  {
    id: "mixtral:latest",
    name: "Mixtral 8x7B",
    description:
      "The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. It outperforms Llama 2 70B on many benchmarks.",
    size: "26GB",
    link: "https://mistral.ai/",
    licenses: [
      {
        title: "Apache 2.0",
        link: "https://choosealicense.com/licenses/apache-2.0/",
      },
    ],
  },
  {
    id: "gemma:2b",
    name: "Gemma 2B",
    description:
      "Gemma is a family of lightweight, state-of-the-art open models built by Google DeepMind.",
    size: "1.7GB",
    link: "https://blog.google/technology/developers/gemma-open-models/",
    licenses: [
      {
        title: "Gemma Terms of Use",
        link: "https://ollama.com/library/gemma:2b#:~:text=Terms%20of%20Use-,View%20license%20%E2%86%97,-8.4kB",
      },
    ],
  },
  {
    id: "gemma:7b",
    name: "Gemma 7B",
    description:
      "Gemma is a family of lightweight, state-of-the-art open models built by Google DeepMind.",
    size: "5.2GB",
    link: "https://blog.google/technology/developers/gemma-open-models/",
    licenses: [
      {
        title: "Gemma Terms of Use",
        link: "https://ollama.com/library/gemma:2b#:~:text=Terms%20of%20Use-,View%20license%20%E2%86%97,-8.4kB",
      },
    ],
  },
  {
    id: "phi:latest",
    name: "Phi-2",
    description:
      "Phi-2: a 2.7B language model by Microsoft Research that demonstrates outstanding reasoning and language understanding capabilities.",
    size: "1.6GB",
    link: "https://www.microsoft.com/en-us/research/blog/phi-2-the-surprising-power-of-small-language-models/",
    licenses: [
      {
        title: "MIT License",
        link: "https://ollama.com/library/phi/blobs/sha256:7908abcab772a6e503cfe014b6399bd58dea04576aaf79412fa66347c72bdd3f",
      },
    ],
  },
  {
    id: "orca-mini:3b",
    name: "Orca-Mini",
    description:
      "A general-purpose model ranging from 3 billion parameters to 70 billion, suitable for entry-level hardware.",
    size: "2.0GB",
    link: "https://arxiv.org/abs/2306.02707",
    licenses: [],
  },
  {
    id: "orca-mini:7b",
    name: "Orca-Mini 7B",
    description:
      "A general-purpose model ranging from 3 billion parameters to 70 billion, suitable for entry-level hardware.",
    size: "3.8GB",
    link: "https://arxiv.org/abs/2306.02707",
    licenses: [],
  },
  {
    id: "orca-mini:13b",
    name: "Orca-Mini 13B",
    description:
      "A general-purpose model ranging from 3 billion parameters to 70 billion, suitable for entry-level hardware.",
    size: "7.4GB",
    link: "https://arxiv.org/abs/2306.02707",
    licenses: [],
  },
  {
    id: "dolphin-mixtral:latest",
    name: "Dolphin Mixtral",
    description:
      "An uncensored, fine-tuned model based on the Mixtral mixture of experts model that excels at coding tasks. Created by Eric Hartford.",
    size: "26GB",
    link: "https://huggingface.co/cognitivecomputations/dolphin-2.5-mixtral-8x7b",
    licenses: [
      {
        title: "Apache License",
        link: "https://ollama.com/library/dolphin-mixtral/blobs/sha256:43070e2d4e532684de521b885f385d0841030efa2b1a20bafb76133a5e1379c1",
      },
    ],
  },
];
