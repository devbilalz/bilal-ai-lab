/**
 * S9 Deep Dive content. Grounded in the `Turing Projects Overview/` docs.
 *
 * CONFIDENTIALITY: internal identifiers (repo names, protobuf/type names,
 * internal spec IDs, validator version tags) are intentionally scrubbed pending
 * Bilal's sign-off - described functionally with clean project names only, per
 * the same discipline used on the resume.
 *
 * GAPS: `challenges`, `lessons`, and `contribution` are null where the source
 * docs are written as pitches rather than engineering journeys. Null => the page
 * renders an honest <Placeholder/>; never fabricate these.
 */

export interface DeepDive {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  constraints: string[];
  architecture: { title: string; body: string }[];
  tradeoffs: { decision: string; chose: string; why: string }[];
  results: { value: string; label: string }[];
  /** From the docs where documented; null => needs Bilal. */
  challenges: string[] | null;
  /** Needs Bilal (interview). */
  lessons: string[] | null;
  /** Needs Bilal - what he personally built vs. the team. */
  contribution: string | null;
  /** Optional real product screenshots served from public/. */
  gallery?: { src: string; alt: string; caption: string }[];
}

export const deepDives: DeepDive[] = [
  {
    slug: "agent-apis",
    title: "Generalized Agent APIs",
    tagline: "The core of the Gemini Gym: a deterministic sandbox for training and grading Gemini on real-world tool use.",
    problem:
      "Training or evaluating an agentic model against live production APIs (real Gmail, Slack, Jira, Salesforce) is risky, non-reproducible, and rate-limited. Worse, when an eval fails you can't tell if the model was wrong or the tool's schema was ambiguous - there's no ground truth, and you can't ask a real API to 'pretend to time out' to test recovery.",
    constraints: [
      "Deterministic and resettable - the same test must run twice with identical starting conditions.",
      "Behaviorally identical to the real service, so learned skills transfer.",
      "Safe by construction - no live user data ever touched.",
      "Scales to thousands of calls without throttling or cost.",
    ],
    architecture: [
      {
        title: "~77 simulated real-world services",
        body: "Full functioning backends for Google Workspace, Slack, GitHub, Jira, Salesforce, Shopify, Stripe and more - each with real business logic, persisted mock state, and typed input/output validation, not stubs.",
      },
      {
        title: "Machine-verifiable tool contracts",
        body: "Every service exposes strict function-call schemas auto-generated from the code itself, so the interface the model learns can never silently drift from the implementation.",
      },
      {
        title: "6-layer validation pipeline",
        body: "A custom validator enforcing API compatibility, quality rules, cross-provider compatibility (Google/OpenAI/Anthropic), runtime checks, and model-spec-to-signature alignment - catching schema defects the standard GenAI SDK silently accepts.",
      },
      {
        title: "Realism + controllability",
        body: "sim2real parity suites prove the sim matches real query syntax; a runtime feature manager injects errors, toggles auth, and mutates schemas on demand; full call-logging captures multi-turn trajectories for replay and scoring.",
      },
    ],
    tradeoffs: [
      {
        decision: "Simulate services vs. test against live APIs",
        chose: "Simulate",
        why: "Buys determinism, safety, and unlimited scale; the fidelity risk is bought back with sim2real parity tests that prove behavioral equivalence.",
      },
      {
        decision: "Auto-generate schemas vs. hand-author them",
        chose: "Auto-generate from code",
        why: "Eliminates schema drift - the contract the model sees is always the contract the code implements.",
      },
      {
        decision: "Custom validator vs. trust the GenAI SDK",
        chose: "Custom 6-layer validator",
        why: "The SDK silently accepts ambiguous/broken tool definitions that teach the model bad habits; validating at the source protects accuracy before training.",
      },
    ],
    results: [
      { value: "77", label: "simulated real-world APIs" },
      { value: "3,200+", label: "automated tests" },
      { value: "42+", label: "validation rules" },
      { value: "~90%", label: "automated quality coverage" },
      { value: "36+", label: "services with regression suites" },
    ],
    challenges: null,
    lessons: null,
    contribution: null,
  },
  {
    slug: "dbgen",
    title: "Synthetic World Engine",
    tagline: "Turns a one-paragraph brief into a schema-exact, narratively coherent training world - plus its grading rubric.",
    problem:
      "A gym needs a populated, believable world behind every simulated API - the actual files, messages, issues, permissions, people and story that connect them. Hand-authoring these fixtures doesn't scale past a handful, so every new scenario, difficulty tier, and distractor pattern becomes a manual authoring project and a bottleneck on training data.",
    constraints: [
      "Schema-exact - indistinguishable from a real account export at the API level.",
      "Narratively coherent - one set of people, projects, and dates threads through every record.",
      "Reproducible - a frozen spec replays to the same world for regression.",
      "Clean boundary - generate the world + rubric only; task authoring and scoring belong to the layer above.",
    ],
    architecture: [
      {
        title: "Service-agnostic synthesis engine",
        body: "One shared engine generates worlds for Google Drive, Slack, and Jira today; adding a new service is a bounded plug-in, not a rewrite.",
      },
      {
        title: "Story-first generation pipeline",
        body: "Spec → authored 'world bible' → dependency graph → generation → cross-record reconciliation → schema-exact projection, so records reference real people and reply to real comments.",
      },
      {
        title: "Rubric authored alongside the world",
        body: "Hard/soft, deterministic and LLM-judged checks tied back to source scenario facts, with producer/verifier separation so grading is a first-class, traceable output.",
      },
      {
        title: "Deep observability",
        body: "Every run keeps a full trace and per-record provenance, so any output field traces back to the exact generation step and model call that produced it.",
      },
    ],
    tradeoffs: [
      {
        decision: "Scope to world + rubric vs. own the full task pipeline",
        chose: "World + rubric only",
        why: "Keeps the engine a reusable substrate under any downstream training program rather than coupling it to one task format.",
      },
      {
        decision: "Story-driven generation vs. independent record synthesis",
        chose: "Single world bible",
        why: "Produces one coherent narrative instead of disconnected stub records that a model (or grader) could tell apart from real data.",
      },
    ],
    results: [
      { value: "3", label: "production SaaS surfaces" },
      { value: "3", label: "Gemini generations validated as authors" },
      { value: "live", label: "multi-turn agent-loop QA rig" },
    ],
    // Documented in the "honest status" section of the source doc.
    challenges: [
      "Content-quality gaps on weaker/faster model generations (e.g. empty generated bodies) surfaced only under real multi-model traffic.",
      "A required schema field silently generated as null failed live tool calls - caught by the agent-loop QA rig before it could corrupt downstream training data.",
      "Rubric-fidelity audits found graders that invented constraints or double-counted a fact as two checks - a flawed rubric damages a training signal as much as flawed data.",
    ],
    lessons: null,
    contribution: null,
  },
  {
    slug: "benchmark-suite",
    title: "Benchmark Mutation Suite",
    tagline: "Stress-tests how gracefully Gemini degrades when tool-use conditions get messy - vs. GPT-5 and Claude.",
    problem:
      "Standard benchmarks only measure performance under ideal conditions. But real agentic deployments see incomplete or renamed tool schemas, context cluttered with irrelevant tools, inputs arriving as images or files, and environments that block native function-calling entirely. The harder, more important question: how much does performance degrade under messy conditions, and does it degrade gracefully or catastrophically?",
    constraints: [
      "Zero edits to any benchmark's source code, so results stay comparable to published baselines.",
      "Mutations reversed after the model responds, so the benchmark's own scoring still works.",
      "Fully isolated per benchmark (containerized).",
      "New benchmarks and new mutations plug into one registry with no orchestrator changes.",
    ],
    architecture: [
      {
        title: "Transparent call interception",
        body: "Every LLM call is intercepted inside an isolated container without the benchmark ever knowing, so any benchmark can be onboarded cheaply.",
      },
      {
        title: "16 mutations across 4 categories",
        body: "Schema (strip docs, rename functions, inject noise), modality (text → image/audio/file), call-format (force text/XML/JSON instead of native function calling), and indirection (hide the query or tools behind a file the model must discover).",
      },
      {
        title: "Composable, incremental degradation",
        body: "One added degradation per experiment isolates exactly which failure mode hurts most - e.g. 'handles renamed tools fine but breaks when docs are stripped'.",
      },
      {
        title: "Trajectories feed the training loop",
        body: "Full labeled interaction traces (query → reasoning → tool calls → results → grade) are packaged into a standardized pipeline that feeds Gemini's broader training/eval ecosystem - closing the loop from 'found a weakness' to 'training signal'.",
      },
    ],
    tradeoffs: [
      {
        decision: "Intercept calls vs. fork/edit each benchmark",
        chose: "Transparent interception",
        why: "Keeps results comparable to published baselines and makes onboarding a new benchmark cheap.",
      },
      {
        decision: "Compose mutations one at a time vs. apply many at once",
        chose: "Incremental composition",
        why: "Pinpoints the specific condition causing a regression instead of a vague 'the model got worse'.",
      },
    ],
    results: [
      { value: "16", label: "mutation types" },
      { value: "10", label: "industry benchmarks" },
      { value: "231", label: "tasks across MCP Universe (6 domains)" },
      { value: "109", label: "tasks in Toolathlon" },
      { value: "3", label: "frontier model families compared" },
    ],
    challenges: null,
    lessons: null,
    contribution: null,
  },
  {
    slug: "swe-evaluation",
    title: "SWE Trajectory Evaluation",
    tagline: "The human-referee layer that produces the trusted answer key for how well models grade AI coding work.",
    problem:
      "Coding agents (Claude, Gemini, GPT) fix bugs across many small steps - reading files, running commands, editing code, summarizing. Finishing a task doesn't mean it was done well: an agent may do things it was told not to, fabricate results ('tests passed' when nothing ran), waste time, skip testing, or write unprofessionally. Models are now asked to grade themselves and each other - so someone trustworthy has to produce the ground-truth labels those self-grades are measured against.",
    constraints: [
      "Judge only on visible evidence - the agent's own words, tool names, and bash commands; tool outputs and non-bash arguments are intentionally stripped.",
      "This mirrors exactly what the model graders saw, so the comparison is fair.",
      "When a problem can't be confirmed from the visible evidence, mark it not-violated - never guess.",
      "Explicit instructions win: if the agent was told to skip tests or be casual, doing so is not a violation.",
    ],
    architecture: [
      {
        title: "A 15-tag quality checklist",
        body: "Every judgment uses the same 15 tags across four themes - Instruction Following, Communication, Efficiency, and Testing - so labels are consistent and comparable across reviewers and models.",
      },
      {
        title: "Trace-level vs. step-level judging",
        body: "Trace = grade the whole trajectory (and record which step numbers each violation occurred at); Step = grade a single proposed next action in isolation. Same tags, two granularities.",
      },
      {
        title: "Verify-the-flags workflow",
        body: "Rather than grading long trajectories from a blank page, reviewers start from the models' own flagged issues and verify each: real flag → violation, false alarm → not-violated. A tag is 'violated' only when at least one model-reported issue for it proves real under human review.",
      },
      {
        title: "Tooling-assisted tracking",
        body: "A tools/ pipeline ingests the CSV/Excel datasets, consolidates every model's flagged issues, and generates a ready-to-fill tracking sheet with the right per-tag verdict and step-number columns.",
      },
    ],
    tradeoffs: [
      {
        decision: "Verify model flags vs. grade every tag from scratch",
        chose: "Verify the flags",
        why: "Focuses scarce human attention on what was actually flagged, making long-trajectory review tractable without sacrificing label quality.",
      },
      {
        decision: "Guess on ambiguous evidence vs. default to not-violated",
        chose: "Default to not-violated",
        why: "The labels are the answer key for the whole project - a confident wrong label is far more damaging than a conservative one.",
      },
    ],
    results: [
      { value: "15", label: "quality tags per judgment" },
      { value: "4", label: "quality themes covered" },
      { value: "trace + step", label: "evaluation granularities" },
      { value: "ground truth", label: "human labels as the answer key" },
    ],
    challenges: null,
    lessons: null,
    contribution: null,
  },
  {
    slug: "sphere",
    title: "Sphere",
    tagline: "Founding-level engineer across three products: EdTech, AI revenue operations, and the world's first AI-powered tax-compliance platform.",
    problem:
      "Sphere started as a live, expert-led upskilling platform for data science and machine learning (originally ScholarSite), used by employees from 500+ companies including Apple, Microsoft, Nike, and BCG, and backed by Y Combinator and Felicis. As the company pivoted, it needed to build AI-powered revenue operations and then the world's first AI-powered tax-compliance platform (sales tax, VAT, and GST), all while keeping the existing product running. The engineering challenge: architect core capabilities across three very different products without a large team.",
    constraints: [
      "Enterprise-grade reliability across three products at once, on a small founding team.",
      "Global indirect-tax rules (sales tax, VAT, GST) span many jurisdictions and change constantly, so correctness and freshness are non-negotiable.",
      "AI outputs feeding compliance decisions must be explainable and auditable, not a black box.",
      "Fast pivots meant the architecture had to let new products stand up quickly without rewriting stable ones.",
    ],
    architecture: [
      {
        title: "EdTech learning platform",
        body: "A Ruby on Rails and React platform delivering live, cohort-based courses: scheduling, content, and enterprise accounts for a 500+ company customer base.",
      },
      {
        title: "AI revenue operations",
        body: "Agentic workflows orchestrating structured and unstructured data across Salesforce, HubSpot, communication channels, and internal knowledge, with Pinecone vector search for retrieval, to automate manual sales operations.",
      },
      {
        title: "AI tax-compliance engine",
        body: "Python and FastAPI services computing multi-jurisdiction sales tax, VAT, and GST, with AI-assisted classification and a validation layer so every automated decision stays auditable.",
      },
    ],
    tradeoffs: [
      {
        decision: "One shared stack vs. a polyglot per product",
        chose: "Polyglot: keep Rails for the mature EdTech app, build new AI and tax services in Python/FastAPI",
        why: "Rewriting a stable, revenue-generating product had no upside, while the new AI workloads needed Python's ecosystem. Splitting by product let each move at its own pace.",
      },
      {
        decision: "Fine-tune models vs. retrieval-augmented generation",
        chose: "Pinecone vector search plus RAG",
        why: "Tax rules and CRM data change constantly and must stay current without retraining; retrieval keeps answers fresh and traceable to a source.",
      },
    ],
    results: [
      { value: "3", label: "enterprise SaaS products built" },
      { value: "500+", label: "companies used the platform" },
      { value: "world-first", label: "AI-powered tax-compliance platform" },
      { value: "CEO + CTO", label: "direct technical-roadmap partnership" },
    ],
    challenges: null,
    lessons: null,
    contribution: null,
    gallery: [
      {
        src: "/deep-dives/sphere/filings.avif",
        alt: "Sphere tax-compliance filings dashboard",
        caption:
          "Filings dashboard - multi-jurisdiction sales tax, VAT, and GST returns tracked from obligation to filed status.",
      },
      {
        src: "/deep-dives/sphere/monitoring.avif",
        alt: "Sphere tax-compliance monitoring dashboard",
        caption:
          "Compliance monitoring - live view of jurisdictions, registration thresholds, and exposure across the platform.",
      },
    ],
  },
  {
    slug: "duett",
    title: "Duett.io",
    tagline: "Referrals done right: the fastest way for care coordinators to match clients to the right home-health providers.",
    problem:
      "Coordinating home-health care was slow and manual: care coordinators had to find, vet, and match providers to each care plan by hand, turning referrals into a multi-day process. Duett set out to take a care plan to a matched provider referral in hours, not days - while handling protected health information safely and giving providers a way to grow their network.",
    constraints: [
      "HIPAA compliance for all protected health information, end to end.",
      "Provider matching had to weigh availability, specialty, and location, not just a keyword search.",
      "Predictive-analytics features were built with data-science partners, so the platform had to integrate their models cleanly.",
    ],
    architecture: [
      {
        title: "Provider-matching engine",
        body: "A matching service on Django and Flask that scored and ranked home-health providers against each patient's needs and coordinator constraints.",
      },
      {
        title: "Predictive-analytics integration",
        body: "A clean integration surface so predictive models built with data-science partners could plug into the marketplace without coupling to the core app.",
      },
      {
        title: "Secure marketplace app",
        body: "A React front end over a PostgreSQL data model on AWS, designed around HIPAA-safe handling of patient and provider data.",
      },
    ],
    tradeoffs: [
      {
        decision: "Django vs. Flask for the services",
        chose: "Both, split by responsibility",
        why: "Django's batteries-included admin and ORM fit the core marketplace, while lightweight Flask services kept the matching and integration endpoints simple and independently deployable.",
      },
    ],
    results: [
      { value: "hours, not days", label: "care plan to provider referral (duett.io)" },
      { value: "HIPAA", label: "compliant by design" },
      { value: "matching", label: "engine replaced manual coordination" },
      { value: "provider growth", label: "two-sided network for coordinators + providers" },
    ],
    challenges: null,
    lessons: null,
    contribution: null,
  },
  {
    slug: "joinreflect",
    title: "JoinReflect",
    tagline: "A digital mental-health platform that predicts therapist fit instead of making patients filter a directory.",
    problem:
      "Getting the right mental-health support is hard: patients struggle to find a therapist who fits, and coordinating ongoing appointments across providers is fragmented. Rather than filter a directory, reflect's approach is matching-first - understanding what a patient needs and predicting which therapist and therapeutic style would actually help, then coordinating scheduling across many independent providers. The engineering had to make that matching and scheduling feel simple and trustworthy with sensitive health data.",
    constraints: [
      "Sensitive personal and health data, so privacy and security came first.",
      "Matching quality mattered as much as speed: a bad therapist fit is worse than none.",
      "Scheduling had to coordinate calendars across many independent providers.",
    ],
    architecture: [
      {
        title: "Recommendation algorithm",
        body: "An intelligent matching algorithm pairing patients with therapists based on needs and fit, rather than a flat directory search.",
      },
      {
        title: "Calendar orchestration",
        body: "A scheduling layer coordinating availability across providers so patients could book and manage care without friction.",
      },
      {
        title: "Secure microservices",
        body: "Scalable Django microservices with a React front end on AWS and PostgreSQL, structured so sensitive data stayed contained.",
      },
    ],
    tradeoffs: [
      {
        decision: "Monolith vs. microservices",
        chose: "Microservices",
        why: "Separating matching, scheduling, and patient data kept sensitive information isolated and let each capability scale and evolve on its own.",
      },
    ],
    results: [
      { value: "matching-first", label: "predicts therapist fit vs. directory search" },
      { value: "100k+", label: "therapy sessions on the platform to date (joinreflect.com)" },
      { value: "4.9 / 5", label: "average therapist rating (platform today)" },
      { value: "20 states", label: "reflect's reach today, from a matching-first foundation" },
    ],
    challenges: null,
    lessons: null,
    contribution: null,
  },
];

export const deepDiveBySlug = (slug: string) =>
  deepDives.find((d) => d.slug === slug);
