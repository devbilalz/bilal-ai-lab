/**
 * Case File content.
 *
 * Internal identifiers (repo names, type names, spec IDs, validator version
 * tags) are intentionally omitted - systems are described functionally with
 * clean project names only.
 *
 * `challenges`, `lessons`, and `contribution` may be null. Null => the page
 * renders a <Placeholder/> instead of copy; the nullable design lets future
 * additions ship with gaps shown honestly rather than filled with guesses.
 */

export interface DeepDive {
  slug: string;
  title: string;
  tagline: string;
  /** Quick-facts strip: real org, period, stack, and delivery status. */
  facts: {
    org: string;
    period: string;
    stack: string[];
    status: string;
  };
  problem: string;
  constraints: string[];
  architecture: { title: string; body: string }[];
  tradeoffs: { decision: string; chose: string; why: string }[];
  /**
   * `metric` => a genuine number, rendered as a big-number card.
   * `fact`   => a qualitative outcome, rendered as a labelled fact row (not
   *             dressed up as a metric). Defaults to `metric` when omitted.
   */
  results: { value: string; label: string; kind?: "metric" | "fact" }[];
  /** Optional honesty caption under Results (e.g. platform-today attribution). */
  resultsNote?: string;
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
    facts: {
      org: "Turing (Google / Gemini)",
      period: "Jun 2024 - Present",
      stack: ["Python", "FastAPI", "Pydantic", "Function Calling"],
      status: "Shipped",
    },
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
        title: "Multi-stage schema validation",
        body: "A custom validation layer checks tool definitions for correctness and cross-provider compatibility before training, catching ambiguous or broken schemas that standard SDKs accept silently - so a bad contract never becomes learned model behavior.",
      },
      {
        title: "Realism + controllability",
        body: "Parity tests check the simulation behaves like the real services; a fault-injection layer can trigger errors, auth failures, and edge cases on demand; and full call-logging captures multi-turn trajectories for replay and scoring.",
      },
    ],
    tradeoffs: [
      {
        decision: "Simulate services vs. test against live APIs",
        chose: "Simulate",
        why: "Buys determinism, safety, and unlimited scale; the fidelity risk is bought back with parity tests that prove behavioral equivalence.",
      },
      {
        decision: "Auto-generate schemas vs. hand-author them",
        chose: "Auto-generate from code",
        why: "Eliminates schema drift - the contract the model sees is always the contract the code implements.",
      },
      {
        decision: "Custom validation vs. trust the standard SDK",
        chose: "A custom validation layer",
        why: "Standard SDKs silently accept ambiguous/broken tool definitions that teach the model bad habits; validating at the source protects accuracy before training.",
      },
    ],
    results: [
      { value: "77", label: "simulated real-world APIs" },
      { value: "3,200+", label: "automated tests" },
      { value: "42+", label: "validation rules" },
      { value: "~90%", label: "automated quality coverage" },
      { value: "36+", label: "services with regression suites" },
    ],
    challenges: [
      "At 77 services the dangerous bugs weren't syntax errors - they were quiet contract mismatches: the model sees one schema, the code accepts another, and the eval starts grading the wrong thing.",
      "The hard part was proving the simulator behaved like the real world, not hoping the mock looked close enough - real APIs have odd query syntax, pagination, auth states, and error behavior.",
      "Every new service threatened to add its own exception, so quality had to scale through the framework and its checks, not through humans remembering rules.",
    ],
    lessons: [
      "A model eval is only as good as the tool contract behind it.",
      "Simulation needs proof - parity tests are what turn a mock into infrastructure.",
      "If quality depends on people remembering rules, the system isn't ready to scale.",
    ],
    contribution:
      "I worked across the whole environment, not one slice of it. I built simulated services with real business logic, strictly-typed models, and persisted state; a system that generates the tool-call schemas directly from the implementation so the interface the model sees can't drift from the code; and a custom validation layer that catches ambiguous or broken tool contracts that standard SDKs accept silently. I also built the realism-and-control layer - parity tests that check the simulation behaves like the real services, a fault-injection layer for errors, auth failures, and edge cases, full multi-turn call-logging, and scenario and regression suites across 36+ services - plus the CI, typing, and generated docs that keep the whole thing production-grade as it scales to each new service.",
  },
  {
    slug: "dbgen",
    title: "Synthetic World Engine",
    tagline: "Turns a one-paragraph brief into a schema-exact, narratively coherent training world - plus its grading rubric.",
    facts: {
      org: "Turing (Google / Gemini)",
      period: "Jun 2024 - Present",
      stack: ["Python", "FastAPI", "Pydantic", "LLM pipelines"],
      status: "Hardening",
    },
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
        title: "Story-first generation",
        body: "Starts from a short brief, builds one coherent backstory, then generates records that reference the same people, projects, and dates - so the world reads as internally consistent rather than disconnected stub data, and finally exports it in the exact target schema.",
      },
      {
        title: "Rubric authored alongside the world",
        body: "Hard/soft, deterministic and LLM-judged checks tied back to source scenario facts, with generation and grading kept separate so the rubric is a first-class, traceable output.",
      },
      {
        title: "Deep observability",
        body: "Every run is fully traceable, so any generated field can be traced back to what produced it.",
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
        chose: "One shared backstory",
        why: "Produces one coherent narrative instead of disconnected stub records that a model (or grader) could tell apart from real data.",
      },
    ],
    results: [
      { value: "3", label: "production SaaS surfaces (Drive, Slack, Jira)" },
      { value: "3", label: "Gemini generations validated as authors" },
      { value: "Live QA harness", label: "multi-turn validation against real schemas", kind: "fact" },
    ],
    // Documented in the "honest status" section of the source doc.
    challenges: [
      "Content-quality gaps on weaker/faster model generations (e.g. empty generated bodies) surfaced only under real multi-model traffic.",
      "A required schema field silently generated as null failed live tool calls - caught by the live QA harness before it could corrupt downstream training data.",
      "Rubric-fidelity audits found graders that invented constraints or double-counted a fact as two checks - a flawed rubric damages a training signal as much as flawed data.",
    ],
    lessons: [
      "Synthetic data isn't useful because it's fake; it's useful when it's controlled, replayable, and gradeable.",
      "Rubrics are part of the dataset - a bad rubric can poison evaluation as much as bad data.",
      "Generation pipelines need record-level observability, because one broken field can invalidate a whole scenario.",
    ],
    contribution:
      "I worked across every phase of the engine, end to end. On generation, I built the story-first pipeline that turns a one-paragraph brief into a schema-exact world across Google Drive, Slack, and Jira on one shared, service-agnostic engine. On grading, I authored the rubric layer (hard and soft, deterministic and LLM-judged checks) so every world ships gradeable, tied back to the source scenario. On evaluation, I ran the multi-model generation trials and built a live QA harness that drives a real Gemini agent through a generated world and validates every response against the real schema. And on scaling and quality, I hardened the engine under real Gemini traffic - closing content-quality gaps, adding resilience to transient model-API failures, and wiring in full traceability so any bad field can be traced back to what produced it.",
  },
  {
    slug: "benchmark-suite",
    title: "Benchmark Mutation Suite",
    tagline: "Stress-tests how gracefully Gemini degrades when tool-use conditions get messy - vs. GPT and Claude.",
    facts: {
      org: "Turing (Google / Gemini)",
      period: "Jun 2024 - Present",
      stack: ["Python", "Docker", "LLM eval"],
      status: "Ongoing",
    },
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
        body: "LLM calls are intercepted and adapted without the benchmark's knowledge and without editing its source, so a new benchmark can be onboarded cheaply.",
      },
      {
        title: "A library of 16 tool-presentation perturbations",
        body: "Systematic ways to make tool use harder - renaming or under-documenting tools, shifting inputs into other modalities (image/audio/file), forcing non-native call formats, or hiding the query behind a file the model must discover first.",
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
    challenges: [
      "Clean benchmarks tell you who wins in a lab; this suite asked who survives when the tool environment gets messy - so the degradations had to be realistic, not arbitrary noise.",
      "The trick was bending benchmark inputs without breaking the benchmark's own scoring: every mutation had to be reversed before grading so results stayed comparable to published baselines.",
      "Composing one degradation at a time was a deliberate constraint - stacking many at once produces a dramatic failure nobody can explain or turn into training signal.",
    ],
    lessons: [
      "Robustness is a curve, not a pass/fail result.",
      "One mutation at a time beats a dramatic stress test nobody can explain.",
      "The most useful eval output isn't a score - it's a failure mode the training loop can act on.",
    ],
    contribution:
      "I built the harness end to end. The core is a transparent interception layer that adapts each tool-use call on the way to the model - stripping docs, renaming functions, shifting modality, forcing non-native call formats, or hiding the query behind a file the model must discover - then reverses the change before grading so results stay directly comparable to published baselines, with no edits to benchmark source. I designed the perturbations to compose one at a time, and built the framework so a new benchmark or a new perturbation plugs in easily. That let me run Gemini head-to-head against GPT and Claude under identical adversarial conditions, and package every run as standardized trajectory data so each discovered weakness flows straight back into the training loop instead of dying in a report.",
  },
  {
    slug: "swe-evaluation",
    title: "SWE Trajectory Evaluation",
    tagline: "The human-referee layer that produces the trusted answer key for how well models grade AI coding work.",
    facts: {
      org: "Turing",
      period: "2024 - Present",
      stack: ["Python", "Rubric design", "CSV/Excel tooling"],
      status: "Ongoing",
    },
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
        body: "A small tooling pipeline ingests the datasets, consolidates every model's flagged issues, and generates a ready-to-fill tracking sheet with the right per-tag verdict and step-number columns.",
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
      { value: "Trace + step", label: "two evaluation granularities", kind: "fact" },
      { value: "Ground truth", label: "human labels as the answer key", kind: "fact" },
    ],
    challenges: [
      "A model can finish the task and still fail the job - skip tests, ignore an instruction, or claim a success it never verified - so 'done' was never the same as 'done well'.",
      "Reviewers saw only what the trace proved (the agent's words, tool names, and bash commands, with tool outputs stripped), exactly mirroring what the model graders saw.",
      "Long trajectories bury the real problem across many steps, and a model's own self-evaluation is a useful hint that is often a false positive - the discipline was to judge only what the evidence proved.",
    ],
    lessons: [
      "Final answers hide process failures; trajectories expose them.",
      "Evaluation quality depends on restraint - don't punish what you can't prove.",
      "A good agent isn't just correct; it's honest about what it actually did.",
    ],
    contribution:
      "I served as the human-referee layer, evaluating AI coding trajectories against a fixed 15-tag rubric across instruction following, communication, efficiency, and testing behavior - at both trace level (grading a whole trajectory and recording the step each violation occurred at) and step level (grading a single proposed action in isolation). I worked the verify-the-flags way: starting from the models' own flagged issues and confirming each against only the visible evidence - the agent's words, tool names, and bash commands - marking a tag violated only when a reported issue proved real under review. The judgment had to be conservative: if the trace didn't prove a violation it stayed unflagged, even when it was tempting to assume one, and an explicit instruction (skip tests, be terse) was never counted against the agent. That restraint is what made the labels trustworthy as the ground-truth answer key for measuring how well models grade their own and each other's work.",
  },
  {
    slug: "sphere",
    title: "Sphere",
    tagline: "Founding-level engineer across three products: EdTech, AI revenue operations, and the world's first AI-powered tax-compliance platform.",
    facts: {
      org: "Sphere",
      period: "Sep 2022 - Sep 2024",
      stack: ["Python (FastAPI)", "Ruby on Rails", "React", "AWS", "Pinecone"],
      status: "Shipped",
    },
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
      {
        title: "AI data tooling and connector automation",
        body: "A serverless doc-to-connector factory that crawls API documentation, embeds it with OpenAI and Pinecone, and generates Airbyte low-code connector manifests on AWS Lambda (SAM), plus a natural-language-to-SQL copilot over CRM and Postgres data - turning unstructured docs and plain questions into structured, source-grounded outputs.",
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
      {
        decision: "Hand-write each data connector vs. generate them from docs",
        chose: "A doc-to-connector factory: crawl documentation, retrieve with embeddings, generate low-code manifests",
        why: "New data sources arrived faster than connectors could be hand-authored, so treating documentation as source material and the connector spec as compiled output turned a repetitive integration task into a repeatable pipeline.",
      },
    ],
    results: [
      { value: "3", label: "enterprise SaaS products built" },
      { value: "500+", label: "companies used the platform" },
      { value: "World-first", label: "AI-powered tax-compliance platform", kind: "fact" },
      { value: "CEO + CTO", label: "direct technical-roadmap partnership", kind: "fact" },
    ],
    challenges: [
      "Sphere wasn't one product wearing three names - it was three different engineering problems (EdTech, revenue AI, and tax compliance) under one startup clock, and the stable products still had to run through every pivot.",
      "The tax platform couldn't be a clever demo: indirect-tax rules span many jurisdictions and change constantly, so correctness, freshness, and auditability were non-negotiable.",
      "AI in revenue operations only works when a human can see the evidence behind a suggestion, so outputs had to stay source-grounded rather than black-box.",
      "Every pivot multiplied the external systems to integrate - CRMs, data warehouses, and finance and tax APIs - so onboarding new data sources had to stop being hand-built one connector at a time.",
    ],
    lessons: [
      "A pivot tests architecture - the parts that survive are the boundaries you drew well.",
      "AI products need evidence chains, especially when they touch sales or compliance decisions.",
      "On a small team, reliability isn't a separate role - it has to be built into everyday product work.",
    ],
    contribution:
      "I worked across Sphere's major pivots - from the Rails and React learning platform to AI revenue workflows, the tax-compliance platform, and the AI data tooling behind them (a doc-to-connector factory and a natural-language-to-SQL copilot) - strongest where product ambiguity met system design: turning fast-moving ideas into reliable APIs, dashboards, integrations, and repeatable pipelines. I partnered closely with leadership on technical direction while helping the team hold quality and delivery steady through each pivot.",
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
    facts: {
      org: "Duett.io (via Devsinc)",
      period: "Jan 2021 - Aug 2022",
      stack: ["Django", "Flask", "React", "PostgreSQL", "AWS"],
      status: "Shipped",
    },
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
      { value: "Hours, not days", label: "care plan to matched provider referral", kind: "fact" },
      { value: "HIPAA", label: "compliant by design, not patched in later", kind: "fact" },
      { value: "Matching engine", label: "replaced manual provider coordination", kind: "fact" },
      { value: "Two-sided", label: "network for coordinators and providers", kind: "fact" },
    ],
    challenges: [
      "This wasn't matching restaurants to reviews - it was matching vulnerable patients to care providers, so correctness and trust mattered more than raw speed.",
      "HIPAA constraints around protected health information had to shape the architecture from the start, not get patched in later.",
      "A good match needed more than keyword search (availability, specialty, location, and care-plan fit), and predictive models built with data-science partners had to plug into real coordinator workflows, not sit in a separate experiment.",
    ],
    lessons: [
      "In healthcare, speed only matters after trust is protected.",
      "Matching engines are product systems, not just algorithms.",
      "Privacy constraints should shape the architecture early, not get patched in later.",
    ],
    contribution:
      "I worked on the marketplace backend and matching workflow that connected care coordinators with home-health providers, translating patient needs into provider-ranking logic and secure workflows that could handle protected health information. I also helped integrate the predictive-analytics work into the product path, so matching intelligence showed up inside real coordinator workflows rather than as a standalone model.",
  },
  {
    slug: "joinreflect",
    title: "JoinReflect",
    tagline: "A digital mental-health platform that predicts therapist fit instead of making patients filter a directory.",
    facts: {
      org: "JoinReflect (via Devsinc)",
      period: "Mar 2020 - Jan 2021",
      stack: ["Django", "React", "PostgreSQL", "AWS"],
      status: "Shipped",
    },
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
      { value: "Matching-first", label: "predicts therapist fit vs. directory search", kind: "fact" },
      { value: "100k+", label: "therapy sessions (platform today)" },
      { value: "4.9 / 5", label: "average therapist rating (platform today)" },
      { value: "20", label: "states served (platform today)" },
    ],
    resultsNote:
      "The 100k+ sessions, 4.9/5 rating, and 20-state reach are JoinReflect's public traction today (joinreflect.com) - built on the matching-first foundation I helped lay in 2020-2021, not metrics I claim as my own.",
    challenges: [
      "Therapist fit is subjective and sensitive - a bad match is costly to a user - so the system had to understand fit, not just filter a directory.",
      "Scheduling conflicts aren't small bugs in mental health; they're moments where a user can lose trust, and the calendar had to coordinate across many independent providers.",
      "Privacy and security had to be built into the matching and scheduling flows, while the product still felt simple over complex backend state.",
    ],
    lessons: [
      "Sensitive products need calm systems - reliability is part of the user experience.",
      "A matching algorithm is only valuable if the surrounding workflow can deliver on the match.",
      "The best backend work disappears for the user: booking feels simple because the complexity moved into the system.",
    ],
    contribution:
      "I built backend services around matching and scheduling: the recommendation flow that paired patients with therapists by needs and stressors, and the calendar orchestration that kept availability usable across independent providers. The work combined product sensitivity with backend discipline, because the system handled personal health context and had to make care feel easier, not more complicated.",
  },
  {
    slug: "rlhf-sft",
    title: "RLHF / SFT Data Curation",
    tagline: "The training-data supply chain behind code-centric fine-tuning across Gemini, Claude, Grok, and ServiceNow AI.",
    facts: {
      org: "Turing",
      period: "Jun 2024 - Present",
      stack: ["SFT / RLHF", "Python", "Rubric design", "Model eval"],
      status: "Ongoing",
    },
    problem:
      "Code-centric model training needs high-quality examples, not just volume. A model is only as good as the data and labels it learns from, so a noisy or inconsistent example doesn't just get ignored - it quietly becomes model behavior. The challenge was to build a curation and review process that could keep quality high across multiple model families and coding stacks, without collapsing under the sheer scale of data required.",
    constraints: [
      "Correctness first - a plausible-but-wrong example is worse than no example.",
      "Prompt fidelity: curated data had to reflect how the model would actually be prompted, not an idealized format.",
      "Multi-stack coverage across languages and frameworks, so gains didn't come at the cost of narrowness.",
      "A latency budget: quality improvements couldn't come by making the model slower to respond.",
      "Reviewer alignment, so many people applying the same rubric produced consistent labels.",
    ],
    architecture: [
      {
        title: "Data curation pipeline",
        body: "Sourcing, filtering, and shaping code-centric examples into training-ready datasets, with the prompt format matched to real inference conditions rather than a clean lab format.",
      },
      {
        title: "Labeling rubrics + review loops",
        body: "Explicit rubrics turned subjective quality into repeatable judgments, and structured review loops caught disagreement early so labels stayed consistent across reviewers.",
      },
      {
        title: "Model evaluation feedback",
        body: "Evaluation results fed back into curation, so the dataset targeted the specific failure modes the models actually showed instead of guessing at what to fix.",
      },
      {
        title: "Multi-model coverage",
        body: "The same discipline applied across Gemini, Claude, Grok, and ServiceNow AI, accounting for differences in how each model responds to the same training signal.",
      },
    ],
    tradeoffs: [
      {
        decision: "Maximize data volume vs. curate for quality",
        chose: "Curate for quality",
        why: "Weak labels scale faster than good intent - a large but noisy dataset teaches the model the noise. Tighter curation produced cleaner signal per example.",
      },
      {
        decision: "Single-reviewer speed vs. rubric-aligned consensus",
        chose: "Rubric-aligned review",
        why: "Consistency across reviewers is what makes labels trustworthy at scale; a fast label nobody else would reproduce is not a reliable training signal.",
      },
    ],
    results: [
      { value: "4", label: "model families curated for" },
      { value: "+18%", label: "contextual accuracy" },
      { value: "-45ms", label: "inference latency" },
      { value: "Code-centric", label: "multi-stack training data", kind: "fact" },
    ],
    challenges: [
      "Noisy or plausible-but-wrong examples slipped in easily and, once trained on, were hard to detect after the fact - the cost of a bad label is paid downstream.",
      "Reviewer consistency was a system problem, not a willpower problem: without explicit rubrics, the same trajectory got labeled differently by different people.",
      "Latency and quality pulled against each other, so every accuracy gain had to be checked against the response-time budget.",
      "Each model family responded differently to the same data, so a signal that helped one could be neutral or harmful to another.",
    ],
    lessons: [
      "Training data is product infrastructure, not a one-off dataset.",
      "Bad labels scale faster than good intent - quality control is the real work.",
      "Latency wins only matter if quality survives them.",
    ],
    contribution:
      "I led SFT and RLHF data curation and model evaluation for code-centric training across Gemini, Claude, Grok, and ServiceNow AI. My focus was treating the dataset as infrastructure: explicit labeling rubrics, review loops that kept reviewers aligned, and an evaluation feedback path so curation targeted the failure modes the models actually showed. The measurable result was higher contextual accuracy without paying for it in latency.",
  },
];

export const deepDiveBySlug = (slug: string) =>
  deepDives.find((d) => d.slug === slug);
