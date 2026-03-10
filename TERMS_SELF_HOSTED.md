# AnythingLLM Self-Hosted: Data Privacy & Terms of Service

This document outlines the privacy standards, data handling procedures, and licensing terms for the self-hosted version of AnythingLLM, developed by Mintplex Labs Inc.

## 1. Data Sovereignty & Local-First Architecture
AnythingLLM is designed as a **local-first** application. When utilizing the self-hosted version (Docker, Desktop, or Source):
* **No External Access:** Mintplex Labs Inc. does not host, store, or have access to any documents, chat histories, workspace settings, or embeddings created within your instance.
* **On-Premise Storage:** All data resides strictly on the infrastructure provisioned and managed by the user or their organization.
* **Air-Gap Capability:** AnythingLLM can be operated in a strictly air-gapped environment with no internet connectivity, provided local LLM and Vector database providers (e.g., Ollama, LocalAI, LanceDB) are utilized.

## 2. Telemetry and Analytics
To improve software performance and stability, AnythingLLM includes an optional telemetry feature.
* **Anonymity:** Collected data is strictly anonymous and contains no Personally Identifiable Information (PII), document content, chat logs, fingerprinting data, or any other sensitive information. Purely usage based data is collected.
* **Opt-Out:** Users may disable telemetry at any time via the **Settings** menu within the application. Once disabled, no usage data is transmitted to Mintplex Labs.

## 3. Third-Party Integrations
AnythingLLM allows users to connect to external services (e.g., OpenAI, Anthropic, Pinecone). 
* **Data Transmission:** When these services are enabled, data is transmitted directly from your instance to the third-party provider. 
* **Governing Terms:** Data handled by third-party providers is subject to their respective Terms of Service and Privacy Policies. Mintplex Labs is not responsible for the data practices of these external entities.

_by default, AnythingLLM does **everything on-device first** - so you would have to manually configure and enable these integrations to be subject to third party terms._

## 4. Security & Network
* **No "Phone Home":** Aside from [optional telemetry](https://github.com/Mintplex-Labs/anything-llm?tab=readme-ov-file#telemetry--privacy), the software does not require an external connection to Mintplex Labs servers to function.
* **Environment Security:** The user is responsible for securing the host environment, including network firewalls, SSL/TLS encryption, and access control for the AnythingLLM instance.
* **CDN Assets:** Out of a convience to international users, we use a hosted CDN to mirror some critical path models (eg: the default embedder and reranking ONNX models) which are not available in all regions. These models are downloaded from our CDN as a fallback, and any air-gapped installations you can either download these models manually or use another provider. Assets of these nature are downloaded once and cached in your associated local storage.

## 5. Licensing and Liability
* **License:** The AnythingLLM core is provided under the **MIT License**.
* **No Warranty:** As per the license agreement, the software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability or fitness for a particular purpose.
* **Liability:** In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use of the software.

## 6. Support and Compatibility
While Mintplex Labs prioritizes stability and backward compatibility, the self-hosted version is used at the user's discretion. Formal Service Level Agreements (SLAs) are not provided for the standard self-hosted version unless otherwise negotiated via a separate enterprise agreement.

---
*Last Updated: March 2026*