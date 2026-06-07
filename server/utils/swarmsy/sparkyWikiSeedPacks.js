const fs = require("fs");
const path = require("path");
const { CollectorApi } = require("../collectorApi");
const { Document } = require("../../models/documents");

const REPO_ROOT = path.resolve(__dirname, "../../..");
const SEED_PACK_SOURCE_ROOT = "docs/swarmsy/sparky-wiki/seed-library/packs";
const IDENTITY_EMPIRE_SOURCE_PATH = `${SEED_PACK_SOURCE_ROOT}/identity-empire`;
const IDENTITY_EMPIRE_FILES = Object.freeze([
  "README.md",
  "IDENTITY_EMPIRE_INDEX.md",
  "01_identity_operating_system.md",
  "02_no_idea_user_intake.md",
  "03_brand_foundation_builder.md",
  "04_story_myth_and_manifesto.md",
  "05_offer_and_product_ladder.md",
  "06_campaign_builder.md",
  "07_pr_and_press_machine.md",
  "08_social_content_engine.md",
  "09_physical_visibility_safe_playbook.md",
  "10_digital_wall_distribution.md",
  "11_swarm_coordination_model.md",
  "12_agent_department_model.md",
  "13_30_day_identity_empire_launch.md",
  "14_local_business_visibility_system.md",
  "15_artist_creator_visibility_system.md",
  "16_measurement_signal_and_next_moves.md",
  "17_sparky_prompt_recipes.md",
  "18_identity_empire_templates.md",
]);

const OFFLINE_WIKI_LEDGER_STANDARDS_FILES = Object.freeze([
  "README.md",
  "INGESTION_PLAN.md",
  "PACK_SCHEMA.md",
  "READINESS_SCORECARD.md",
  "SOURCE_GOVERNANCE.md",
  "MISSING_DATA_REGISTRY.md",
  "CANONICAL_QUESTIONS_STANDARD.md",
  "CLAIM_MAP_STANDARD.md",
  "PACK_READINESS_GATE.md",
  "SOURCE_CARD_SCHEMA.json",
  "SUBJECT_EXPANSION_QUEUE.md",
  "INDUSTRY_COVERAGE_MAP.md",
  "RELEASE_READY_PACKS.md",
]);
const CULTURAL_PROTOCOLS_FILES = Object.freeze([
  "BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md",
  "SUPREME_DROP_SCARCITY_PROTOCOL.md",
  "RED_BULL_SPECTACLE_PROTOCOL.md",
  "NIKE_IDENTITY_COMPRESSION_PROTOCOL.md",
  "APPLE_1984_CATEGORY_DISRUPTION_PROTOCOL.md",
  "BERNAYS_PUBLIC_OPINION_PROTOCOL.md",
  "MEME_CULTURE_VIRAL_LOOP_PROTOCOL.md",
  "ARG_MYSTERY_TRAIL_PROTOCOL.md",
  "CONTROLLED_REBELLION_REGENERATION_PROTOCOL.md",
  "SYNTHETIC_MOMENTUM_AND_MANUFACTURED_AUTHENTICITY_PROTOCOL.md",
]);
const CAMPAIGN_CASE_STUDIES_FILES = Object.freeze([
  "MASTER_MARKETERS_OVERVIEW.md",
  "OGILVY.md",
  "EDWARD_BERNAYS.md",
  "APPLE_1984.md",
  "NIKE_JUST_DO_IT.md",
  "RED_BULL_STRATOS.md",
  "SUPREME_DROP_CULTURE.md",
  "BANKSY_PUBLIC_SIGNAL.md",
]);
const WIKI_DEPTH_AND_PROVENANCE_FILES = Object.freeze([
  "APP_BRAIN_KNOWLEDGE_INDEX.md",
  "BRAIN_INDEX.md",
  "AUTHORITY_AND_PROVENANCE_LAYER.md",
  "WIKI_DEPTH_TREE_DOCTRINE.md",
  "MULTI_LAYER_CONVERSATIONAL_DEPTH_ENGINE.md",
]);

const BANKSY_DEPTH_TREE_FILES = Object.freeze([
  "README.md",
  "advanced/index.md",
  "beginner/index.md",
  "branches.json",
  "campaigns/index.md",
  "citation-index.md",
  "claim-map.md",
  "counterarguments/index.md",
  "criticism/index.md",
  "disputed-claims/index.md",
  "economics/index.md",
  "emotional-interpretations/index.md",
  "ethics/index.md",
  "expert/index.md",
  "future-implications/index.md",
  "index.md",
  "institutional-response/index.md",
  "manipulation-analysis/index.md",
  "media-analysis/index.md",
  "modern-equivalents/index.md",
  "mythology-lore/index.md",
  "narrative-analysis/index.md",
  "psychology/index.md",
  "regeneration-impact/index.md",
  "source-cards/banksy-better-out-than-in-archive-2013.json",
  "source-cards/banksy-cut-run-glasgow-council-2025.json",
  "source-cards/banksy-dismaland-economy-time-2015.json",
  "source-cards/banksy-dismaland-time-2015.json",
  "source-cards/banksy-love-bin-guinness-2021.json",
  "source-cards/banksy-love-bin-sothebys-2021.json",
  "source-cards/banksy-official-site.json",
  "source-cards/banksy-seasons-greetings-guardian-2019.json",
  "source-cards/banksy-slave-labour-guardian-2013.json",
  "source-cards/banksy-slave-labour-la-times-2013.json",
  "source-cards/banksy-walled-off-hotel-cbs-2017.json",
  "source-cards/bbc-game-changer-sale.json",
  "source-cards/christies-game-changer.json",
  "source-cards/pest-control-auth.json",
  "source-cards/sothebys-love-bin-2021.json",
  "source-conflicts/index.md",
  "sparky-answer-notes.md",
  "speculation/index.md",
  "timelines/index.md",
]);
const OPEN_CULTURAL_INTELLIGENCE_FILES = Object.freeze([
  "KNOWLEDGE_GRAPH_RETRIEVAL_COMPRESSION.md",
  "KNOWLEDGE_GRAPH_RETRIEVAL_REFERENCE_PLAN.md",
  "NETWORKED_WEBSITE_FUTURE.md",
  "OPEN_CULTURAL_INTELLIGENCE_DOCTRINE.md",
  "README.md",
]);
const SWARMSY_PRODUCT_OPERATOR_DOCTRINE_FILES = Object.freeze([
  "README.md",
  "RUNTIME_ACTION_KERNEL.md",
  "SPARKY_APP_ACTIONS.md",
  "USER_ACTION_AUTOPILOT_RULES.md",
  "WIDGET_MANAGER.md",
  "WIDGET_MANAGER_REFERENCE_IMPLEMENTATION_PLAN.md",
  "WORKSPACE_BRAIN_MANAGER.md",
  "WORKSPACE_RAG_SHELL.md",
  "WORKSPACE_RAG_SHELL_REFERENCE_IMPLEMENTATION_PLAN.md",
]);
const SWARMSY_SUPPORT_AND_PROVIDER_HELP_FILES = Object.freeze([
  "BEGINNER_MODE_HELP.md",
  "BROWSER_FIRST_TROUBLESHOOTING.md",
  "EXPERT_MODE_HELP.md",
  "EXTERNAL_HELP_CONNECTIONS.md",
  "PROVIDER_FAILURE_PLAYBOOK.md",
  "README.md",
  "TELEGRAM_GATED_BUILDER_ACCESS.md",
]);

const SWARMSY_CORE_TRUTH_ARCHIVE_FILES = Object.freeze([
  "HOW_TO_USE.md",
  "MEGATRUTH.md",
  "README.md",
  "README_MEGA_STREET_SWARM.md",
  "SPARKY_SINGLE_APP_BRAIN_PERSONA.md",
  "SPARKY_SINGLE_APP_BRAIN_PERSONA_AUDIT.md",
  "STREET_SWARM_BUILD_READINESS.md",
  "STREET_SWARM_CURRENT_TRUTH.md",
  "STREET_SWARM_FINAL_MEGA_BUILD_TRUTH.md",
  "SWARMSY_APP_DIRECTION.md",
  "V1_HANDOFF.md",
]);
const IDENTITY_FORGE_AND_CAMPAIGN_OS_FILES = Object.freeze([
  "AI_WYSIWYG_AUTOPILOT_BUILDER.md",
  "EMPIRE_BRAND_BUILDER_PLAYBOOK.md",
  "IDENTITY_FORGE_CAMPAIGN_INTELLIGENCE.md",
  "README.md",
  "doctrine__FRICTION_CREATES_SOUL.md",
  "doctrine__SWARM_PHASE.md",
  "doctrine__THE_BOOTLOADER_WAKES_UP.md",
  "doctrine__THE_WRITING_IS_ON_THE_WALL.md",
  "identity-forge-2__AGENT_DEPARTMENT_MODEL.md",
  "identity-forge-2__IDENTITY_DNA_SCHEMA.md",
  "identity-forge-2__IDENTITY_FORGE_2_ARCHITECTURE.md",
  "identity-forge-2__SPARKY_ROULETTE_FORMULA.md",
  "product__PHYSICAL_DROP_MODULE_CANON.md",
  "product__STREET_SWARM_SWARMSY_PRODUCT_CANON.md",
  "product__SWARMSY_DESIGN_CANON.md",
  "product__SWARMSY_DESKTOP_CORE_CANON.md",
  "product__SWARMSY_FULL_MANIFESTO.md",
  "product__SWARMSY_VISIBILITY_DOCTRINE.md",
  "product__THE_UNWRITTEN_WALL_MANIFESTO.md",
]);
const COMMUNITY_AND_OPEN_BUILD_GOVERNANCE_FILES = Object.freeze([
  "ARCHIVE_CONTRIBUTION_GUIDE.md",
  "BUG_REPORT_TEMPLATE.md",
  "COMMUNITY_BUILD_GUIDE.md",
  "COMMUNITY_EDITING_GUIDE.md",
  "COMMUNITY_GOVERNANCE.md",
  "PRIVACY_POLICY.md",
  "README.md",
  "community__ARCHIVE_EDITING_RULES.md",
  "community__COMMUNITY_EDITING_GUIDE.md",
  "community__DEPTH_BRANCH_CONTRIBUTION_GUIDE.md",
  "community__GOOD_FIRST_ARCHIVE_TASKS.md",
  "community__LOCAL_DEVELOPMENT_SETUP.md",
  "community__MAINTAINER_REVIEW_CHECKLIST.md",
  "community__PROTOCOL_CONTRIBUTION_GUIDE.md",
  "community__PROVENANCE_AND_SOURCE_CARD_GUIDE.md",
  "safety__SAFETY_BOUNDARIES.md",
]);
const SOURCE_CARD_AND_SUBJECT_GOVERNANCE_FILES = Object.freeze([
  "README.md",
  "brain__history__DOCUMENTARY_CAMPAIGN_HISTORY_NOTES.md",
  "brain__source_cards__PLATFORM_POLICY_AND_LAWFUL_TRANSFORMATION_SOURCE_CARD.md",
  "brain__source_cards__UNDERGROUND_VISIBILITY_PATTERNS_SOURCE_CARD.md",
  "wiki__deep__DEEP_DIVE_BANKSY_FULL_CULTURAL_ARCHAEOLOGY.md",
  "wiki__deep__DEEP_DIVE_MEME_CULTURE_VIRAL_LOOPS.md",
  "wiki__deep__DEEP_DIVE_SUPREME_HYPE_ECONOMICS.md",
  "wiki__protocols__PROTOCOL_TEMPLATE.md",
]);
const LOCAL_USER_SUPPORT_AND_TROUBLESHOOTING_ARCHIVE_FILES = Object.freeze([
  "DEMO_DATA_GUIDE.md",
  "DESKTOP_RELEASE_QA.md",
  "DESKTOP_USER_DOWNLOAD.md",
  "LOCAL_DEVELOPMENT.md",
  "LOCAL_DEV_CHECKLIST.md",
  "PC_LOCAL_BRAIN_USAGE.md",
  "README.md",
]);
const PRODUCT_PLANNING_ARCHIVE_FILES = Object.freeze([
  "BRANDING_ASSETS.md",
  "DESKTOP_APP_PLAN.md",
  "NEXT_PHASE_ROADMAP.md",
  "README.md",
  "ROADMAP.md",
  "STREET_SWARM_CORE_LITE_ARCHITECTURE.md",
  "SYNTHESIS_PROMPT_LIBRARY.md",
  "design__SWARMSY_DESKTOP_CORE_VISUAL_DIRECTION.md",
  "roadmap__SWARMSY_DESKTOP_CORE_ROADMAP.md",
]);
const SWARMSY_APP_BRAIN_REFERENCE_ARCHIVE_FILES = Object.freeze([
  "README.md",
  "brain__00-source-refresh-protocol.md",
  "brain__01-ceo-operator-brain.md",
  "brain__02-brand-identity-forge-brain.md",
  "brain__03-campaign-os-brain.md",
  "brain__04-search-visibility-brain.md",
  "brain__05-copywriting-sales-brain.md",
  "brain__06-content-brain.md",
  "brain__07-local-business-brain.md",
  "brain__08-public-promotion-safety-brain.md",
  "brain__09-uk-advertising-compliance-brain.md",
  "brain__10-business-finance-brain.md",
  "brain__11-privacy-security-data-brain.md",
  "brain__12-ux-accessibility-design-brain.md",
  "brain__13-github-devops-brain.md",
  "brain__15-momentum-task-loop-brain.md",
  "brain__16-brand-doctor-brain.md",
  "brain__17-creative-direction-visual-dna-brain.md",
  "brain__18-offline-operator-playbooks.md",
  "brain__19-ecommerce-merch-brain.md",
  "brain__20-trades-services-brain.md",
  "brain__21-events-hospitality-brain.md",
  "brain__22-music-creator-rights-brain.md",
  "brain__23-community-email-brain.md",
  "brain__24-analytics-measurement-brain.md",
  "brain__25-health-wellbeing-boundary-brain.md",
  "brain__26-legal-risk-escalation-brain.md",
  "brain__27-ai-agent-orchestration-brain.md",
  "brain__28-local-custom-build-mode-brain.md",
  "brain__29-research-source-triage-brain.md",
  "brain__30-pricing-monetization-brain.md",
  "brain__31-paid-ads-media-buying-brain.md",
  "brain__32-pr-publicity-press-brain.md",
  "brain__33-community-swarm-ops-brain.md",
  "brain__34-product-management-brain.md",
  "brain__35-knowledge-import-quality-brain.md",
  "brain__36-release-readiness-brain.md",
  "brain__37-sector-adaptation-brain.md",
  "brain__38-competitive-positioning-brain.md",
  "brain__39-partnerships-sponsorships-brain.md",
  "brain__40-training-agent-handover-brain.md",
  "brain__41-open-llm-model-routing-brain.md",
  "brain__41-ugc-testimonials-reviews-brain.md",
  "brain__42-funnel-landing-page-brain.md",
  "brain__42-hermes-local-brain-profile.md",
  "brain__42-structured-output-schemas-brain.md",
  "brain__43-offer-ladder-brain.md",
  "brain__43-open-source-agent-frameworks-brain.md",
  "brain__44-customer-support-reputation-brain.md",
  "brain__45-b2b-outreach-brain.md",
  "brain__45-structured-output-contracts-brain.md",
  "brain__46-cloudflare-worker-d1-brain.md",
  "brain__46-grants-funding-investor-brain.md",
  "brain__46-rag-retrieval-eval-brain.md",
  "brain__47-free-open-model-watchlist.md",
  "brain__47-github-public-repo-ingestion-brain.md",
  "brain__47-ip-naming-trademark-brain.md",
  "brain__48-crisis-comms-brain.md",
  "brain__48-edgy-but-safe-persona-brain.md",
  "brain__49-adversarial-influence-red-team-brain.md",
  "brain__49-agent-evals-and-regression-brain.md",
  "brain__49-physical-asset-production-brain.md",
  "brain__50-ai-visibility-entities-schema-brain.md",
  "brain__50-underground-history-lore-brain.md",
  "brain__51-app-brain-source-governance-brain.md",
  "brain__51-fantasy-simulation-disclaimer-brain.md",
  "brain__51-influencer-creator-collab-brain.md",
  "brain__52-social-proof-ethics-brain.md",
  "brain__52-tool-permission-model-brain.md",
  "brain__52-workflow-automation-zapier-nocode-brain.md",
  "brain__53-activism-community-campaign-brain.md",
  "brain__53-knowledge-graph-entity-brain.md",
  "brain__53-training-course-education-brain.md",
  "brain__54-charity-community-impact-brain.md",
  "brain__54-stock-trader-risk-brain.md",
  "brain__55-ai-safety-boundary-router.md",
  "brain__55-app-brain-import-taxonomy.md",
  "brain__55-offline-first-reward-event-queue-brain.md",
  "brain__56-sparky-tone-style-brain.md",
  "brain__57-street-swarm-product-doctrine-brain.md",
  "brain__58-brain-pack-qa-checklist.md",
  "brain__59-swarm-npc-lore-agents-brain.md",
  "brain__60-fake-engagement-red-flags-brain.md",
  "brain__61-campaign-compiler-brain.md",
  "brain__62-rabbit-hole-knowledge-graph-brain.md",
  "brain__63-citation-source-card-schema-brain.md",
  "brain__64-pattern-transformer-policy-brain.md",
  "brain__65-risk-trader-thinking-brain.md",
  "brain__66-activist-community-campaign-brain.md",
  "brain__67-legal-guerrilla-marketing-brain.md",
  "brain__68-fan-community-gameplay-brain.md",
  "brain__69-persona-asset-system-brain.md",
  "brain__70-sparky-edge-tone-brain.md",
  "brain__71-historical-case-study-schema-brain.md",
  "brain__72-deception-red-flags-brain.md",
  "brain__73-public-wiki-source-card-brain.md",
  "brain__75-model-routing-current-tech-brain.md",
  "brain__76-brain-pack-ingestion-plan.md",
  "brain__INGESTION_READINESS.md",
  "brain__MANIFEST.md",
  "brain__README_SANDBOX.md",
  "brain__SOURCE_REFRESH_PROTOCOL.md",
  "brain__personas__SPARKY_OPERATOR_PERSONA_NOTES.md",
  "brain__playbooks__MOMENTUM_TASK_LOOP_PLAYBOOK.md",
  "brain__playbooks__SPARKY_SOURCE_ROUTING_PLAYBOOK.md",
  "brain__product__APP_GAME_COMMUNITY_CLOUT_RULES.md",
  "brain__product__IDENTITY_FORGE_CREATIVE_DNA_EXPANSION.md",
  "brain__safety__DOCUMENTARY_RED_TEAM_SAFETY_BOUNDARY.md",
  "brain__tasks__MOMENTUM_TASK_SYSTEM_SCHEMA.md",
]);

const seedPackPath = (packId) => `${SEED_PACK_SOURCE_ROOT}/${packId}`;

const OPTIONAL_CAMPAIGN_PACK_TRIGGER_PATTERN =
  /campaign|launch|brand|public signal|public relations|earned media|advertising|copy|positioning|propaganda|persuasion|media|stunt|spectacle|scarcity|drop|limited|queue|hype|meme|\barg\b|viral|culture|press|\bpr\b|case stud|nike|just do it|slogan|identity compression|banksy|street art|mystery|archive|supreme|red bull|stratos|event|world record|apple 1984|apple|1984|category|enemy|disrupt|bernays|berneys|public opinion|ogilvy/i;

function optionalCampaignPackPromptMatches(prompt = "") {
  return OPTIONAL_CAMPAIGN_PACK_TRIGGER_PATTERN.test(String(prompt || ""));
}

const SAFETY_BOUNDARIES = Object.freeze([
  "Local-first reference knowledge only; not required doctrine.",
  "No autonomous runtime agents are created by importing this pack.",
  "Use lawful, permission-based physical visibility only.",
  "No vandalism, trespass, evasion, harassment, threats, or fake claims.",
  "API/web lookup stays optional and only for explicitly requested live research.",
]);

const PACKS = Object.freeze([
  Object.freeze({
    id: "identity-empire",
    title: "SPARKY Identity Empire",
    shortDescription:
      "Book-grade local wiki pack for building identity, story, brand, offers, campaigns, PR angles, slogans, content systems, lawful visibility, launch plans, measurement, and next moves from zero signal.",
    category: "identity empire seed pack",
    status: "docs/spec-only source, importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: IDENTITY_EMPIRE_SOURCE_PATH,
    includedFiles: IDENTITY_EMPIRE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach to the current SWARMSY workspace so Sparky can automatically retrieve deep local playbooks during Face Identity Mode, Hidden Identity Mode, Existing Project rebuilds, Memory Lock continuations, and direct identity-building prompts.",
    importable: true,
  }),
  Object.freeze({
    id: "offline-wiki-ledger-standards",
    title: "Offline Wiki Ledger Standards",
    shortDescription:
      "Docs/spec-only standards for future book-grade wiki pack structure, scoring, sourcing, readiness gates, claim maps, and lawful reuse.",
    category: "offline wiki ledger standards",
    status:
      "docs/spec-only source, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("offline-wiki-ledger-standards"),
    includedFiles: OFFLINE_WIKI_LEDGER_STANDARDS_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when designing or auditing future local wiki packs. Use as optional source-governance reference only; never as current app truth or runtime policy.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "cultural-protocols",
    title: "Cultural Protocols",
    shortDescription:
      "Reference protocols for lawful cultural and campaign mechanics: public signals, scarcity, spectacle, identity compression, memes, ARG trails, and risk handling.",
    category: "cultural protocols",
    status: "reference knowledge, importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("cultural-protocols"),
    includedFiles: CULTURAL_PROTOCOLS_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when Sparky needs public-evidence cultural mechanics for lawful campaign strategy, ethics, consequence mapping, and post-campaign analysis.",
    importable: true,
  }),
  Object.freeze({
    id: "campaign-case-studies",
    title: "Campaign Case Studies",
    shortDescription:
      "Deep reference examples from Ogilvy, Bernays, Apple 1984, Nike Just Do It, Red Bull Stratos, Supreme drops, and Banksy public signals.",
    category: "campaign case studies",
    status: "reference knowledge, importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("campaign-case-studies"),
    includedFiles: CAMPAIGN_CASE_STUDIES_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when Sparky should ground campaign advice in named case studies instead of generic brand advice.",
    importable: true,
  }),
  Object.freeze({
    id: "wiki-depth-and-provenance",
    title: "Wiki Depth and Provenance",
    shortDescription:
      "Governance layer for source labels, claim maps, citation indexes, depth-tree rules, disputed labels, and retrieval priority.",
    category: "wiki depth and provenance",
    status:
      "docs/spec-only source, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("wiki-depth-and-provenance"),
    includedFiles: WIKI_DEPTH_AND_PROVENANCE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when auditing provenance, disputed claims, citation trees, or retrieval priority for local SPARKY Wiki reference packs.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "banksy-depth-tree",
    title: "Banksy Depth Tree",
    shortDescription:
      "Book-grade Banksy subject tree for public-signal, campaign, cultural, media, provenance, disputed-claim, myth/lore, and source-conflict analysis.",
    category: "banksy depth tree",
    status:
      "reference knowledge, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("banksy-depth-tree"),
    includedFiles: BANKSY_DEPTH_TREE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when Sparky needs deep Banksy/public-signal analysis with source cards, claim maps, disputed labels, myth/lore separation, and lawful adaptation boundaries.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "open-cultural-intelligence",
    title: "Open Cultural Intelligence",
    shortDescription:
      "Docs/spec reference for local-first open cultural intelligence, provenance-aware wiki reasoning, knowledge-graph direction, and agent-readable boundaries.",
    category: "open cultural intelligence",
    status:
      "docs/spec-only source, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("open-cultural-intelligence"),
    includedFiles: OPEN_CULTURAL_INTELLIGENCE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when discussing provenance-aware cultural intelligence, future wiki/website/knowledge-graph direction, and local-first reasoning boundaries.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "swarmsy-product-operator-doctrine",
    title: "SWARMSY Product Operator Doctrine",
    shortDescription:
      "Docs/spec-only future product/operator design references for app actions, workspace brain, RAG shell, widgets, and autopilot boundaries without runtime wiring.",
    category: "swarmsy product operator doctrine",
    status:
      "docs/spec-only source, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("swarmsy-product-operator-doctrine"),
    includedFiles: SWARMSY_PRODUCT_OPERATOR_DOCTRINE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach only for future product/operator planning. Treat as docs/spec reference, not runtime actions, autonomous agents, widgets, source-editing ability, or current app truth.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "swarmsy-support-and-provider-help",
    title: "SWARMSY Support and Provider Help",
    shortDescription:
      "Local setup, provider failure, beginner/expert help, browser-first troubleshooting, external help, and Telegram access reference updated for current app boundaries.",
    category: "swarmsy support and provider help",
    status:
      "reference knowledge, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("swarmsy-support-and-provider-help"),
    includedFiles: SWARMSY_SUPPORT_AND_PROVIDER_HELP_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when Sparky should answer setup/provider/troubleshooting questions locally while preserving current DIZ/SWARMSY behavior and explicit Use API boundaries.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "swarmsy-core-truth-archive",
    title: "SWARMSY Core Truth Archive",
    shortDescription:
      "Historical truth, manifest, persona, direction, and handoff material preserved as optional reference without overriding current DIZ-A-REMIX truth.",
    category: "swarmsy core truth archive",
    status:
      "reference knowledge, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("swarmsy-core-truth-archive"),
    includedFiles: SWARMSY_CORE_TRUTH_ARCHIVE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach for SWARMSY doctrine, language, and lineage as optional context; never as current app truth, provider routing, or runtime behavior.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "identity-forge-and-campaign-os",
    title: "Identity Forge and Campaign OS",
    shortDescription:
      "Old Identity Forge, campaign OS, product manifesto, movement-building, offer/empire-building, and media-engine reference doctrine with lawful-use boundaries.",
    category: "identity forge and campaign os",
    status:
      "reference knowledge, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("identity-forge-and-campaign-os"),
    includedFiles: IDENTITY_FORGE_AND_CAMPAIGN_OS_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when Sparky needs SWARMSY identity/campaign doctrine for lawful brand, offer, movement, and campaign planning; never as automation or runtime control.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "community-and-open-build-governance",
    title: "Community and Open Build Governance",
    shortDescription:
      "Community editing, contribution, provenance, maintainer review, archive governance, privacy, and safety reference material for workspace-only use.",
    category: "community and open build governance",
    status:
      "reference knowledge, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("community-and-open-build-governance"),
    includedFiles: COMMUNITY_AND_OPEN_BUILD_GOVERNANCE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when discussing community contribution, source review, archive stewardship, provenance workflow, or open-build etiquette.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "source-card-and-subject-governance",
    title: "Source Card and Subject Governance",
    shortDescription:
      "Source-card, provenance, subject-governance, source-refresh, citation, and knowledge-import quality material for SPARKY Wiki packs.",
    category: "source card and subject governance",
    status:
      "reference knowledge, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("source-card-and-subject-governance"),
    includedFiles: SOURCE_CARD_AND_SUBJECT_GOVERNANCE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when evaluating claims, source cards, citation quality, subject boundaries, disputed labels, or source-refresh work.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "local-user-support-and-troubleshooting-archive",
    title: "Local User Support and Troubleshooting Archive",
    shortDescription:
      "Old local setup, demo, PC/local brain, desktop download, and QA support docs adapted as draft reference for current local-first/Ollama boundaries.",
    category: "local user support and troubleshooting archive",
    status: "draft reference, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("local-user-support-and-troubleshooting-archive"),
    includedFiles: LOCAL_USER_SUPPORT_AND_TROUBLESHOOTING_ARCHIVE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach only for local user support archaeology and troubleshooting context; verify current behavior before giving setup instructions.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "product-planning-archive",
    title: "Product Planning Archive",
    shortDescription:
      "Future/draft product planning, roadmap, design, synthesis, desktop-core, and brand asset references preserved without implying live features.",
    category: "product planning archive",
    status: "draft reference, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("product-planning-archive"),
    includedFiles: PRODUCT_PLANNING_ARCHIVE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach for product planning archaeology, roadmap comparison, and future feature ideation; never present as live runtime capability.",
    importable: true,
    draftImportable: true,
  }),
  Object.freeze({
    id: "swarmsy-app-brain-reference-archive",
    title: "SWARMSY App Brain Reference Archive",
    shortDescription:
      "Old app-brain role notes for operator, brand, campaign, content, compliance, monetization, research, safety, and sector adaptation work.",
    category: "swarmsy app brain reference archive",
    status:
      "reference knowledge, draft-importable workspace reference knowledge",
    docsSpecOnly: true,
    sourcePath: seedPackPath("swarmsy-app-brain-reference-archive"),
    includedFiles: SWARMSY_APP_BRAIN_REFERENCE_ARCHIVE_FILES,
    safetyBoundaries: SAFETY_BOUNDARIES,
    recommendedWorkspaceUseCase:
      "Attach when Sparky needs broad SWARMSY app-brain role context as optional local reference; never as deterministic Offline App Brain runtime.",
    importable: true,
    draftImportable: true,
  }),
]);

const seedPackImportLocks = new Map();

function clonePack(pack) {
  if (!pack) return null;
  return {
    ...pack,
    includedFiles: [...pack.includedFiles],
    safetyBoundaries: [...pack.safetyBoundaries],
  };
}

function listSparkyWikiSeedPacks() {
  return PACKS.map(clonePack);
}

function isSafePackId(packId = "") {
  return /^[a-z0-9][a-z0-9-]*$/.test(String(packId || ""));
}

function getSparkyWikiSeedPack(packId = "") {
  if (!isSafePackId(packId)) return null;
  return clonePack(PACKS.find((pack) => pack.id === packId));
}

function getSeedPackRelativeFilePath(pack, fileName) {
  if (!pack?.includedFiles?.includes(fileName)) return null;
  const relativePath = path.posix.join(pack.sourcePath, fileName);
  if (!relativePath.startsWith(`${pack.sourcePath}/`)) return null;
  return relativePath;
}

function getSeedPackAbsoluteFilePath(pack, fileName) {
  const relativePath = getSeedPackRelativeFilePath(pack, fileName);
  if (!relativePath) return null;

  const absolutePath = path.resolve(REPO_ROOT, relativePath);
  const sourceRoot = path.resolve(REPO_ROOT, pack.sourcePath);
  const relativeToSource = path.relative(sourceRoot, absolutePath);
  if (
    relativeToSource.startsWith("..") ||
    path.isAbsolute(relativeToSource) ||
    relativeToSource.includes(path.sep + ".." + path.sep)
  ) {
    return null;
  }
  return absolutePath;
}

function parseJsonMetadata(raw = "") {
  try {
    const parsed = JSON.parse(raw);
    return parsed?.metadata || null;
  } catch {
    return null;
  }
}

function parseSeedPackMetadata(raw = "", fileName = "") {
  if (String(fileName).toLowerCase().endsWith(".json")) {
    return parseJsonMetadata(raw);
  }
  return parseMarkdownFrontmatter(raw);
}

function parseMarkdownFrontmatter(raw = "") {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---", 4);
  if (end === -1) return null;

  const fields = {};
  const frontmatter = raw.slice(4, end).split(/\r?\n/);
  for (const line of frontmatter) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    fields[match[1]] = match[2].replace(/^['"]|['"]$/g, "").trim();
  }
  return fields;
}

function validateSeedPackFiles(packId = "") {
  const pack = getSparkyWikiSeedPack(packId);
  if (!pack) {
    return {
      valid: false,
      errorCode: "UNKNOWN_PACK",
      message: "Unknown SPARKY Wiki seed pack.",
      files: [],
    };
  }

  const files = [];
  const errors = [];
  for (const fileName of pack.includedFiles) {
    const absolutePath = getSeedPackAbsoluteFilePath(pack, fileName);
    const relativePath = getSeedPackRelativeFilePath(pack, fileName);
    if (!absolutePath || !relativePath) {
      errors.push({ file: fileName, error: "unsafe_path" });
      continue;
    }

    if (!fs.existsSync(absolutePath)) {
      errors.push({ file: fileName, error: "missing" });
      continue;
    }

    const raw = fs.readFileSync(absolutePath, "utf8");
    const frontmatter = parseSeedPackMetadata(raw, fileName);
    if (!frontmatter?.title || !frontmatter?.category) {
      errors.push({ file: fileName, error: "missing_frontmatter" });
      continue;
    }

    files.push({
      file: fileName,
      path: relativePath,
      absolutePath,
      frontmatter,
      byteLength: Buffer.byteLength(raw),
    });
  }

  return {
    valid: errors.length === 0,
    errorCode: errors.length ? "INVALID_PACK_FILES" : null,
    message: errors.length
      ? "One or more SPARKY Wiki seed pack files failed validation."
      : "SPARKY Wiki seed pack files are valid.",
    pack,
    files,
    errors,
  };
}

function getWorkspaceSummary(workspace = null) {
  if (!workspace) return null;
  return {
    exists: true,
    id: workspace.id,
    slug: workspace.slug,
    name: workspace.name,
  };
}

function safeParseMetadata(metadata) {
  try {
    return JSON.parse(metadata || "null");
  } catch {
    return null;
  }
}

function getExistingChunkSources(existingDocs = []) {
  const existingChunkSources = new Set();
  for (const existingDoc of existingDocs) {
    const metadata = safeParseMetadata(existingDoc.metadata);
    if (metadata?.chunkSource)
      existingChunkSources.add(String(metadata.chunkSource));
  }
  return existingChunkSources;
}

function seedPackDocFile(doc = {}, packId = "") {
  const metadata = safeParseMetadata(doc.metadata);
  const chunkSource = String(metadata?.chunkSource || "");
  const chunkPrefix = `sparky-wiki-seed-pack://${packId}/`;
  if (
    metadata?.sparkyWikiSeedPack !== packId &&
    !chunkSource.startsWith(chunkPrefix)
  ) {
    return null;
  }

  if (metadata?.sparkyWikiSeedPackFile) {
    return String(metadata.sparkyWikiSeedPackFile);
  }

  if (!chunkSource.startsWith(chunkPrefix)) return null;
  return chunkSource.slice(chunkPrefix.length) || null;
}

async function getWorkspaceSeedPackFiles(workspace, packIds = []) {
  const result = new Map(packIds.map((packId) => [packId, new Set()]));
  if (!workspace?.id || packIds.length === 0) return result;

  const workspaceDocs = await Document.where(
    { workspaceId: workspace.id },
    null,
    null,
    null,
    { metadata: true }
  );

  for (const doc of workspaceDocs || []) {
    for (const packId of packIds) {
      const file = seedPackDocFile(doc, packId);
      if (file) result.get(packId).add(file);
    }
  }
  return result;
}

function discoverRelevantOptionalSeedPackSections({
  prompt = "",
  packFiles = new Map(),
} = {}) {
  const text = String(prompt || "").toLowerCase();
  const sections = [];
  const add = (packId, file, reason) => {
    if (!packFiles.get(packId)?.has(file)) return;
    sections.push({
      packId,
      file,
      path: `${seedPackPath(packId)}/${file}`,
      reason,
    });
  };

  if (optionalCampaignPackPromptMatches(text)) {
    add(
      "cultural-protocols",
      "BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md",
      "public signal and earned media mechanics"
    );
    add(
      "cultural-protocols",
      "NIKE_IDENTITY_COMPRESSION_PROTOCOL.md",
      "identity compression mechanics"
    );
    add(
      "cultural-protocols",
      "MEME_CULTURE_VIRAL_LOOP_PROTOCOL.md",
      "social spread loop mechanics"
    );
    add(
      "campaign-case-studies",
      "MASTER_MARKETERS_OVERVIEW.md",
      "master marketer overview context"
    );
  }
  if (/scarcity|drop|limited|queue|hype|supreme/.test(text)) {
    add(
      "cultural-protocols",
      "SUPREME_DROP_SCARCITY_PROTOCOL.md",
      "scarcity and release timing mechanics"
    );
    add(
      "campaign-case-studies",
      "SUPREME_DROP_CULTURE.md",
      "drop-culture case study"
    );
  }
  if (/spectacle|red bull|stratos|event|world record/.test(text)) {
    add(
      "cultural-protocols",
      "RED_BULL_SPECTACLE_PROTOCOL.md",
      "spectacle design mechanics"
    );
    add("campaign-case-studies", "RED_BULL_STRATOS.md", "spectacle case study");
  }
  if (/apple|1984|category|enemy|disrupt/.test(text)) {
    add(
      "cultural-protocols",
      "APPLE_1984_CATEGORY_DISRUPTION_PROTOCOL.md",
      "category disruption mechanics"
    );
    add(
      "campaign-case-studies",
      "APPLE_1984.md",
      "category disruption case study"
    );
  }
  if (/nike|just do it|slogan|identity compression/.test(text)) {
    add(
      "cultural-protocols",
      "NIKE_IDENTITY_COMPRESSION_PROTOCOL.md",
      "identity compression mechanics"
    );
    add(
      "campaign-case-studies",
      "NIKE_JUST_DO_IT.md",
      "identity compression case study"
    );
  }
  if (/bernays|public opinion|propaganda|\bpr\b|public relations/.test(text)) {
    add(
      "cultural-protocols",
      "BERNAYS_PUBLIC_OPINION_PROTOCOL.md",
      "public opinion history and ethics"
    );
    add(
      "campaign-case-studies",
      "EDWARD_BERNAYS.md",
      "public opinion case study"
    );
  }
  if (/ogilvy|copy|positioning|advertising/.test(text)) {
    add(
      "campaign-case-studies",
      "OGILVY.md",
      "research-backed advertising case study"
    );
  }
  if (/banksy|public signal|street art|mystery|archive/.test(text)) {
    add(
      "cultural-protocols",
      "BANKSY_STYLE_PUBLIC_SIGNAL_PROTOCOL.md",
      "lawful public signal mechanics"
    );
    add(
      "campaign-case-studies",
      "BANKSY_PUBLIC_SIGNAL.md",
      "public signal case study"
    );
  }

  return sections.filter(
    (section, index, all) =>
      all.findIndex(
        (candidate) =>
          candidate.packId === section.packId && candidate.file === section.file
      ) === index
  );
}

function getPackLockKey(workspace, packId) {
  if (workspace?.id != null) return `${workspace.id}:${packId}`;
  return `${workspace?.slug || "unknown"}:${packId}`;
}

async function withSeedPackImportLock(workspace, packId, run) {
  const lockKey = getPackLockKey(workspace, packId);
  const previousLock = seedPackImportLocks.get(lockKey) || Promise.resolve();
  let releaseCurrentLock;
  const currentLock = new Promise((resolve) => {
    releaseCurrentLock = resolve;
  });
  const lockChain = previousLock.then(() => currentLock);
  seedPackImportLocks.set(lockKey, lockChain);

  await previousLock;
  try {
    return await run();
  } finally {
    releaseCurrentLock();
    if (seedPackImportLocks.get(lockKey) === lockChain) {
      seedPackImportLocks.delete(lockKey);
    }
  }
}

async function importSparkyWikiSeedPack({
  workspace,
  packId,
  userId = null,
} = {}) {
  if (!workspace) {
    throw new Error("Workspace is required for SPARKY Wiki seed pack import.");
  }
  if (!isSafePackId(packId)) {
    return {
      success: false,
      errorCode: "UNSAFE_PACK_ID",
      message: "SPARKY Wiki seed pack id is not valid.",
    };
  }

  const validation = validateSeedPackFiles(packId);
  if (!validation.valid) {
    return {
      success: false,
      errorCode: validation.errorCode,
      message: validation.message,
      pack: validation.pack || null,
      files: validation.files || [],
      errors: validation.errors || [],
    };
  }

  const pack = validation.pack;
  if (!pack.importable) {
    return {
      success: false,
      errorCode: "PACK_NOT_IMPORTABLE",
      message: "This SPARKY Wiki seed pack is not importable yet.",
      pack,
    };
  }

  return await withSeedPackImportLock(workspace, pack.id, async () => {
    const collector = new CollectorApi();
    const collectorOnline = await collector.online();
    if (!collectorOnline) {
      return {
        success: false,
        errorCode: "COLLECTOR_OFFLINE",
        message: "Document processing API is not online.",
        pack,
      };
    }

    const existingDocs = await Document.forWorkspace(workspace.id);
    const existingChunkSources = getExistingChunkSources(existingDocs);
    const imported = [];
    const skipped = [];
    const failed = [];

    for (const file of validation.files) {
      const chunkSource = `sparky-wiki-seed-pack://${pack.id}/${file.file}`;
      if (existingChunkSources.has(chunkSource)) {
        skipped.push({
          path: file.path,
          reason: "already_attached",
          error: null,
        });
        continue;
      }

      const {
        success,
        reason,
        documents = [],
      } = await collector.forwardExtensionRequest({
        endpoint: "/process",
        method: "POST",
        body: {
          filename: file.file,
          options: { absolutePath: file.absolutePath },
          metadata: {
            ...file.frontmatter,
            title: file.frontmatter.title || file.file,
            docSource: `SPARKY Wiki seed pack: ${pack.title}`,
            description: `${pack.shortDescription} Source: ${file.path}`,
            chunkSource,
            sparkyWikiSeedPack: pack.id,
            sparkyWikiSeedPackTitle: pack.title,
            sparkyWikiSeedPackFile: file.file,
            sparkyWikiSeedPackSourcePath: pack.sourcePath,
            localFirst: true,
            optionalReferenceKnowledge: true,
            autonomousRuntimeAgents: false,
          },
        },
      });

      if (!success || documents.length === 0 || !documents[0]?.location) {
        failed.push({
          path: file.path,
          stage: "collect",
          error:
            reason ||
            "Collector did not return an ingestible document location.",
        });
        continue;
      }

      const {
        failedToEmbed = [],
        errors = [],
        embedded = [],
      } = await Document.addDocuments(
        workspace,
        [documents[0].location],
        userId
      );

      if (failedToEmbed.length > 0 || embedded.length === 0) {
        failed.push({
          path: file.path,
          stage: "embed",
          error:
            errors[0] ||
            "Document.addDocuments failed for this seed pack file.",
        });
        continue;
      }

      imported.push({ path: file.path });
      existingChunkSources.add(chunkSource);
    }

    const partial = failed.length > 0;
    const alreadyAttachedCount = skipped.filter(
      (item) => item.reason === "already_attached"
    ).length;
    const allAlreadyAttached =
      imported.length === 0 && alreadyAttachedCount === validation.files.length;

    return {
      success: true,
      workspace: getWorkspaceSummary(workspace),
      pack,
      imported,
      skipped,
      failed,
      partial,
      status: allAlreadyAttached
        ? "already_added"
        : partial
          ? "partial"
          : "added",
      message: allAlreadyAttached
        ? `${pack.title} knowledge is already attached to this workspace.`
        : partial
          ? "SPARKY Wiki seed pack import completed with partial failures."
          : `${pack.title} knowledge added to this workspace.`,
    };
  });
}

function discoverRelevantIdentityEmpireSections({
  prompt = "",
  mode = "",
} = {}) {
  const text = `${prompt} ${mode}`.toLowerCase();
  const matches = new Set(["IDENTITY_EMPIRE_INDEX.md"]);

  const addWhen = (needles, files) => {
    if (needles.some((needle) => text.includes(needle))) {
      files.forEach((file) => matches.add(file));
    }
  };

  addWhen(
    ["from nothing", "no idea", "identity", "intake"],
    [
      "01_identity_operating_system.md",
      "02_no_idea_user_intake.md",
      "18_identity_empire_templates.md",
    ]
  );
  addWhen(
    ["hidden", "alias", "pseudonym", "privacy"],
    ["02_no_idea_user_intake.md", "04_story_myth_and_manifesto.md"]
  );
  addWhen(
    ["face", "founder", "public"],
    ["03_brand_foundation_builder.md", "04_story_myth_and_manifesto.md"]
  );
  addWhen(
    ["existing", "audit", "rebuild", "relaunch"],
    [
      "03_brand_foundation_builder.md",
      "06_campaign_builder.md",
      "13_30_day_identity_empire_launch.md",
    ]
  );
  addWhen(["brand", "messy idea"], ["03_brand_foundation_builder.md"]);
  addWhen(
    ["offer", "product", "service", "ladder"],
    ["05_offer_and_product_ladder.md"]
  );
  addWhen(["campaign", "stickup"], ["06_campaign_builder.md"]);
  addWhen(["pr", "press", "ghost"], ["07_pr_and_press_machine.md"]);
  addWhen(
    ["slogan", "social", "content"],
    ["08_social_content_engine.md", "17_sparky_prompt_recipes.md"]
  );
  addWhen(
    ["physical", "visibility", "wall", "flyer", "lawful"],
    [
      "09_physical_visibility_safe_playbook.md",
      "10_digital_wall_distribution.md",
    ]
  );
  addWhen(["swarm", "coordinate"], ["11_swarm_coordination_model.md"]);
  addWhen(
    ["30-day", "30 day", "launch"],
    ["13_30_day_identity_empire_launch.md"]
  );
  addWhen(
    ["measure", "signal", "next"],
    ["16_measurement_signal_and_next_moves.md"]
  );

  return [...matches].map((file) => ({
    packId: "identity-empire",
    file,
    path: `${IDENTITY_EMPIRE_SOURCE_PATH}/${file}`,
  }));
}

function __resetSeedPackImportLocksForTests() {
  seedPackImportLocks.clear();
}

module.exports = {
  BANKSY_DEPTH_TREE_FILES,
  CAMPAIGN_CASE_STUDIES_FILES,
  CULTURAL_PROTOCOLS_FILES,
  IDENTITY_EMPIRE_FILES,
  SWARMSY_APP_BRAIN_REFERENCE_ARCHIVE_FILES,
  PRODUCT_PLANNING_ARCHIVE_FILES,
  LOCAL_USER_SUPPORT_AND_TROUBLESHOOTING_ARCHIVE_FILES,
  SOURCE_CARD_AND_SUBJECT_GOVERNANCE_FILES,
  COMMUNITY_AND_OPEN_BUILD_GOVERNANCE_FILES,
  IDENTITY_FORGE_AND_CAMPAIGN_OS_FILES,
  SWARMSY_CORE_TRUTH_ARCHIVE_FILES,
  OFFLINE_WIKI_LEDGER_STANDARDS_FILES,
  OPEN_CULTURAL_INTELLIGENCE_FILES,
  OPTIONAL_CAMPAIGN_PACK_TRIGGER_PATTERN,
  SWARMSY_PRODUCT_OPERATOR_DOCTRINE_FILES,
  SWARMSY_SUPPORT_AND_PROVIDER_HELP_FILES,
  WIKI_DEPTH_AND_PROVENANCE_FILES,
  REPO_ROOT,
  discoverRelevantIdentityEmpireSections,
  getSeedPackAbsoluteFilePath,
  getSeedPackRelativeFilePath,
  getSparkyWikiSeedPack,
  getWorkspaceSeedPackFiles,
  importSparkyWikiSeedPack,
  discoverRelevantOptionalSeedPackSections,
  isSafePackId,
  listSparkyWikiSeedPacks,
  parseJsonMetadata,
  parseMarkdownFrontmatter,
  optionalCampaignPackPromptMatches,
  parseSeedPackMetadata,
  seedPackDocFile,
  validateSeedPackFiles,
  __resetSeedPackImportLocksForTests,
};
