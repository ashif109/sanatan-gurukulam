export interface MicroserviceMeta {
  id: string;
  name: string;
  purpose: string;
  dbStructure: string;
  apiContracts: string[];
  relationships: string;
  eventsProduced: string[];
  eventsConsumed: string[];
  permissionRules: string;
  adminControls: string[];
  analyticsTracking: string;
  failureRecovery: string;
  scalabilityStrategy: string;
}

export const microservicesData: { [key: string]: MicroserviceMeta } = {
  auth: {
    id: 'auth',
    name: 'Authentication Service',
    purpose: 'Enforces robust multi-tenant token validation, SSO federated handshakes, MFA authentication cascades, and cryptographically secure credentials verification.',
    dbStructure: `CREATE TABLE auth_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  hashed_password VARCHAR(255) NOT NULL,
  two_factor_secret VARCHAR(128),
  mfa_enabled BOOLEAN DEFAULT FALSE,
  backup_codes VARCHAR(64)[]
);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_hash VARCHAR(128) UNIQUE INDEX,
  ip_address INET,
  user_agent VARCHAR(512),
  device_fingerprint VARCHAR(128),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    apiContracts: [
      'POST /api/v1/auth/register - Create secure student/instructor gateway auth credentials',
      'POST /api/v1/auth/login - Generate payload-signed JWT & refresh key pairs',
      'POST /api/v1/auth/mfa/challenge - Validate authenticator TOTP token values',
      'POST /api/v1/auth/sso/handshake - SAML/OIDC federated redirect callbacks'
    ],
    relationships: 'Links credentials directly into User Service records; maintains invalidation arrays with Redis Pub/Sub channels.',
    eventsProduced: [
      'UserRegistered - Broadcasted when credential record generates successfully',
      'UserSessionCreated - Emitted upon correct SSO or standard email password login',
      'MfaLockTriggered - Spawned on consecutive verification entry faults'
    ],
    eventsConsumed: [
      'UserSuspended - Forces immediate Redis cache session invalidation matches',
      'UserPasswordResetRequested - Triggers secure password link payload builds'
    ],
    permissionRules: 'Open registration endpoints, session state query rules restricted to Admin/SuperAdmin profiles.',
    adminControls: [
      'Terminate All User Sessions - Force logouts across cluster points',
      'Revoke MFA Secrets - Force clean re-enrollments for target UID',
      'View Audit Access Fingerprints - Intersect IP, country, and ASN ranges'
    ],
    analyticsTracking: 'Monitors peak request logins, MFA pass percentages, failed threshold breaches, and malicious brute-force attempts.',
    failureRecovery: 'Active-Active DB session sync over hot-replicas with instant stateless fallback keys when relational stores fail.',
    scalabilityStrategy: 'Partition session caches with Redis Cluster sharding; rate-limit endpoints per CIDR block via Envoy proxies.'
  },
  user: {
    id: 'user',
    name: 'User Service',
    purpose: 'Stores full consolidated user records, profile details, background files, and tenant accounts across all institutional branches.',
    dbStructure: `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  email VARCHAR(255) UNIQUE INDEX,
  full_name VARCHAR(128) NOT NULL,
  avatar_url VARCHAR(512),
  biography TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    apiContracts: [
      'GET /api/v1/users/:id - Pull demographic data structures',
      'PUT /api/v1/users/:id/profile - Update avatar metadata, socials, or bios',
      'POST /api/v1/users/merge - Merge duplicate emails or guest trial paths'
    ],
    relationships: 'Core relational junction. Relates to Roles matrix, Course logs, and Payment profiles.',
    eventsProduced: [
      'UserProfileUpdated - Broadcasts core metadata shifts to the cluster',
      'UserAccountMerged - Emitted when matching historical records consolidates'
    ],
    eventsConsumed: [
      'AuthRegistered - Dispatches trigger to populate zero-profile states'
    ],
    permissionRules: 'Users read/write own profile; Organization Managers read team arrays; Admins control full system listings.',
    adminControls: [
      'Deactivate User Profile - Toggle tenant state flags',
      'Impersonate Profile Payload - Yields secure tokens for customer care investigations',
      'Request GDPR Right-to-Erasure - Completely clear personal databases records'
    ],
    analyticsTracking: 'Tracks user lifecycle growth indexes, active usage ratios (DAU/MAU), and geographical user density mappings.',
    failureRecovery: 'Caching profile logs inside regional multi-zone keystores with lazy-loading fallback to master PostgreSQL database.',
    scalabilityStrategy: 'Sharded database architectures using User UUID ranges to divide high transactional tables seamlessly.'
  },
  role: {
    id: 'role',
    name: 'Role Service',
    purpose: 'Maintains enterprise role levels, hierarchical mappings, and custom tenant roles with fine-grained control parameters.',
    dbStructure: `CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key VARCHAR(64) UNIQUE NOT NULL INDEX,
  role_title VARCHAR(128) NOT NULL,
  hierarchy_level INT DEFAULT 0,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    apiContracts: [
      'GET /api/v1/roles - List entire hierarchy definitions',
      'POST /api/v1/roles/custom - Create localized corporate role matrices'
    ],
    relationships: 'Related via user_roles junction charts to Roles and Users databases.',
    eventsProduced: [
      'RoleAssignmentChanged - Broadcast changes to regenerate security tokens',
      'CustomRoleCreated - Broadcast custom rule maps to active Envoy gateways'
    ],
    eventsConsumed: [],
    permissionRules: 'Strictly restricted to Admin and Super Admin roles for update or removal capabilities.',
    adminControls: [
      'Configure System Hierarchies - Set safety override levels for users',
      'Bind Domain Rules - Trigger automated assignments based on OIDC attributes'
    ],
    analyticsTracking: 'Tracks total counts per role assignments, custom group variances, and system authorization limits.',
    failureRecovery: 'Strict static schema replication with high-read cache buffers loaded automatically during boot.',
    scalabilityStrategy: 'In-memory distribution of full authorization matrices across all edge proxies.'
  },
  permission: {
    id: 'permission',
    name: 'Permission Service',
    purpose: 'Enforces complete resource authorization policies, URL route masks, and button-level action locks.',
    dbStructure: `CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_key VARCHAR(64) NOT NULL,
  resource_key VARCHAR(64) NOT NULL,
  UNIQUE(action_key, resource_key)
);`,
    apiContracts: [
      'POST /api/v1/permissions/authorize - Real-time policy checking gateway',
      'GET /api/v1/permissions/matrix - Retrieve role-action policy matrix mappings'
    ],
    relationships: 'Maps permission action matches to roles and custom operational users.',
    eventsProduced: [
      'SecurityPolicyMatrixUpdated - Forces cluster route-guards rebuilds'
    ],
    eventsConsumed: [],
    permissionRules: 'Enforced dynamically using Casbin schemas. Only Super Admin has write authorization.',
    adminControls: [
      'Audit Active Permission Gaps - Evaluate access rule violations',
      'Override Gateway Policies - Lock downs individual endpoints globally'
    ],
    analyticsTracking: 'Monitors gateway check times, policy parsing speeds, and suspicious multi-failed privilege errors.',
    failureRecovery: 'Local in-memory client library caches with automated failover back-channels.',
    scalabilityStrategy: 'Stateless authorization instances configured with zero-dependency horizontal scaling.'
  },
  course: {
    id: 'course',
    name: 'Course Service',
    purpose: 'Controls syllabus definition modules, pricing levels, meta SEO parameters, draft workflows, and version branches.',
    dbStructure: `CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(512) NOT NULL,
  slug VARCHAR(512) UNIQUE INDEX,
  short_summary VARCHAR(1024),
  description TEXT,
  level_tag VARCHAR(64),
  pricing_tier_id UUID,
  primary_instructor_id UUID,
  course_state VARCHAR(64) DEFAULT 'draft',
  version_number INT DEFAULT 1,
  seo_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    apiContracts: [
      'GET /api/v1/courses - Fetch catalog listings',
      'POST /api/v1/courses - Begin drafting new syllabus content',
      'PUT /api/v1/courses/:id/publish - Finalize course to marketplace searches'
    ],
    relationships: 'Parent directory for Curriculum, Lessons, Media files, and Student course purchases histories.',
    eventsProduced: [
      'CourseCreated - Dispatched on syllabus layout beginnings',
      'CoursePublished - Notifies Search engine, notifications, and analytics pipelines',
      'CourseVersionArchived - Emitted upon complete version changes'
    ],
    eventsConsumed: [
      'InstructorKycApproved - Unlocks course publication capabilities'
    ],
    permissionRules: 'Instructors manage own courses; Moderators audit uploads; Admins handle marketplace structures.',
    adminControls: [
      'Enforce Sandbox Moderation - Quarantine suspect course material uploads',
      'Revoke Course Publication - Delist courses from search pathways',
      'Force Clone/Migrate Course - Re-link course content across multiple tenants'
    ],
    analyticsTracking: 'Monitors view analytics, drop timings, page bounce, conversion and visual catalog interaction maps.',
    failureRecovery: 'Elasticsearch read cache indices decoupled from primary transactional tables.',
    scalabilityStrategy: 'Static HTML pages delivered via global CDN caches with dynamic catalog widgets.'
  },
  curriculum: {
    id: 'curriculum',
    name: 'Curriculum Service',
    purpose: 'Manages fine-grained structural elements of courses, containing modules, chapters, and multi-format lessons.',
    dbStructure: `CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE module_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  lesson_type VARCHAR(64) NOT NULL,
  content_reference_id VARCHAR(255),
  sort_order INT NOT NULL
);`,
    apiContracts: [
      'POST /api/v1/curriculum/modules - Add a structural module container',
      'PUT /api/v1/curriculum/lessons/order - Stagger or reorder lesson paths inside chapter grids'
    ],
    relationships: 'Links Courses directly with specific structural item databases like Video assets or Coding Challenges.',
    eventsProduced: [
      'CurriculumSyllabusModified - Emitted on re-ordering or module additions'
    ],
    eventsConsumed: [],
    permissionRules: 'Authorized content creators with primary edit permissions on course profiles.',
    adminControls: [
      'Audit Modular Consistency - Checks database paths for dangling assets',
      'Incorporate Standard Templates - Automatically generates standardized course paths'
    ],
    analyticsTracking: 'Evaluates curriculum completion speeds, common lesson exit paths, and content density ratings.',
    failureRecovery: 'Generates full index snapshots on Redis for instant sidebar outline renders.',
    scalabilityStrategy: 'Nested JSON cache mappings loaded into cache clusters directly.'
  },
  media: {
    id: 'media',
    name: 'Media Service',
    purpose: 'Handles secure multi-format storage pathways, adaptive video transcoding jobs, HLS content streams, and secure PDF file distribution.',
    dbStructure: `CREATE TABLE physical_media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  file_name VARCHAR(512),
  mime_type VARCHAR(128),
  bytes_size BIGINT,
  storage_location VARCHAR(512),
  transcode_status VARCHAR(64) DEFAULT 'pending',
  resolutions_manifest JSONB
);`,
    apiContracts: [
      'POST /api/v1/media/upload - Secure S3 multi-part pre-signed URL initiator',
      'GET /api/v1/media/stream/:id - Fetch signed cookie playback tokens'
    ],
    relationships: 'Serves secure video/audio links to Curriculum lessons.',
    eventsProduced: [
      'MediaUploadSucceeded - Triggers transcoder engine queue tasks',
      'MediaTranscodeCompleted - Delivers parsed resolutions path metadata'
    ],
    eventsConsumed: [
      'LessonDeleted - Triggers background garbage collection routines for dead files'
    ],
    permissionRules: 'Supports fully signed time-locked query parameters to block illegal course downloads.',
    adminControls: [
      'Configure Storage Allocations - Restrict instructor upload capacity',
      'Re-trigger Failed Transcodes - Push failed transcoder logs to cluster lists manually'
    ],
    analyticsTracking: 'Measures total global bandwidth volume consumed, video buffering ratios, and transcoding times.',
    failureRecovery: 'Store master backup files on archival storage; dual-replicate on dynamic localized CDNs.',
    scalabilityStrategy: 'Asynchronous workers handling ffmpeg tasks using spot instances.'
  },
  liveClass: {
    id: 'liveClass',
    name: 'Live Class Service',
    purpose: 'Enables high-fidelity streaming channels, live whiteboard workspaces, interactive polls, Q&A systems, and attendance tracking dashboards.',
    dbStructure: `CREATE TABLE live_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_instructor_id UUID NOT NULL,
  room_identifier VARCHAR(255) UNIQUE INDEX,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  max_participants INT DEFAULT 1000,
  attendance_history JSONB
);`,
    apiContracts: [
      'POST /api/v1/live/broadcasts - Provision a WebRTC/Zoom room session',
      'GET /api/v1/live/sessions/:id/attendance - Calculate exact student watch time records'
    ],
    relationships: 'Syncs student presence indicators directly into Analytics performance metrics.',
    eventsProduced: [
      'LiveClassChannelOpened - Dispatches event trigger alerts to all enrolled students',
      'LiveClassCompleted - Emitted when stream terminates, preparing recorded playback links'
    ],
    eventsConsumed: [],
    permissionRules: 'Host instructors and administrative users possess full presenter capabilities; students have limited listener privileges.',
    adminControls: [
      'Override Live Session - Ends abusive broadcasts instantly',
      'Mute All Classroom Participants - Enforces administrative locks over classroom audios'
    ],
    analyticsTracking: 'Measures class connection latencies, chat interaction rates, drop-off, and aggregate attendance.',
    failureRecovery: 'Dual-ingress media servers utilizing WebRTC fallback protocols and alternate server instances.',
    scalabilityStrategy: 'Deploy geographically load-balanced cluster nodes based on active participant concentrations.'
  },
  exam: {
    id: 'exam',
    name: 'Examination Service',
    purpose: 'Manages dynamic assessments, proctor webcam diagnostics, cheating telemetry recorders, randomized question pools, and adaptive marking protocols.',
    dbStructure: `CREATE TABLE exams_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  time_limit_minutes INT,
  proctoring_enabled BOOLEAN DEFAULT TRUE,
  passing_grade NUMERIC(5,2)
);

CREATE TABLE question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams_meta(id) ON DELETE CASCADE,
  content_data JSONB NOT NULL,
  cognitive_depth VARCHAR(64) DEFAULT 'v1'
);`,
    apiContracts: [
      'POST /api/v1/exams/:id/attempts - Initiate proctor-locked exam window',
      'POST /api/v1/exams/attempts/:id/submit - Score adaptive assessment schemas'
    ],
    relationships: 'Feeds successful certification outputs straight to Certification generators.',
    eventsProduced: [
      'ExamAttemptStarted - Pushes security block indicators to gateways',
      'ExamCheatingIncidentTriggered - Alerts active admins of severe tab switches/identity issues',
      'ExamAttemptCompleted - Initiates grading algorithms'
    ],
    eventsConsumed: [],
    permissionRules: 'Students access within specific windows; Instructors modify questions; Admins review cheating reports.',
    adminControls: [
      'Bypass Cheating Disqualification - Manually override proctor-flagged fails',
      'Re-grade Assessment Set - Globally recalculate test results after key fixes'
    ],
    analyticsTracking: 'Tracks test difficulty distributions, cheating markers, average wait times, and question completion speeds.',
    failureRecovery: 'Active local-browser state logging protects answers from device battery failure or disconnection.',
    scalabilityStrategy: 'Read-replica database routing for fast, massive exam-window accesses.'
  },
  certification: {
    id: 'certification',
    name: 'Certification Service',
    purpose: 'Issues dynamic certificates, cryptographically signs credential hashes, publishes verification anchors, and scales QR verification endpoints.',
    dbStructure: `CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  course_id UUID NOT NULL,
  merkle_root_hash VARCHAR(128) UNIQUE INDEX,
  blockchain_transaction_id VARCHAR(256),
  revocation_status BOOLEAN DEFAULT FALSE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    apiContracts: [
      'GET /api/v1/certs/verify/:hash - Open verification link (QR codes destination)',
      'POST /api/v1/certs/issue - Force print credentials on customized templates'
    ],
    relationships: 'Generates lineage credentials from successful Lesson or Exam outcomes.',
    eventsProduced: [
      'CertificateGenerated - Dispatches digital print files to notifications',
      'CertificateRevoked - Emitted when a certificate is revoked due to cheating'
    ],
    eventsConsumed: [
      'CourseCompleted - Receives event to build certificate files instantly'
    ],
    permissionRules: 'Anyone can query verification hashes; only authorized institutions can generate certificate sequences.',
    adminControls: [
      'Revoke Verifiable Credential - Delists certified record safely',
      'Update SVG Vector Master Template - Modifies structural layout, border rules, or signature keys'
    ],
    analyticsTracking: 'Tracks total certificates issued daily, verification lookup frequencies, and scan percentages.',
    failureRecovery: 'Secure offsite transaction ledger storage protects certificate authenticity checks.',
    scalabilityStrategy: 'Serverless deployment instances handle QR code generations and secure PDF outputs.'
  },
  payment: {
    id: 'payment',
    name: 'Payment Service',
    purpose: 'Controls global billing entries, processes payment pathways, distributes instructor payouts, and generates legal invoice assets.',
    dbStructure: `CREATE TABLE platform_ledgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref VARCHAR(255) UNIQUE INDEX,
  user_id UUID NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  fee_deductions NUMERIC(10,2),
  currency VARCHAR(16) DEFAULT 'INR',
  charge_provider VARCHAR(64) DEFAULT 'Stripe',
  charge_state VARCHAR(64) NOT NULL
);`,
    apiContracts: [
      'POST /api/v1/payments/intent - Build secure gateway invoice targets',
      'POST /api/v1/payments/webhooks - Process provider signals (Stripe/Paypal)'
    ],
    relationships: 'Unlocks student permissions; logs commissions; generates invoice logs.',
    eventsProduced: [
      'PaymentSucceeded - Confirms purchase, granting content access privileges',
      'ChargebackAlertTriggered - Alerts platform risk-management teams'
    ],
    eventsConsumed: [
      'RefundApproved - Reverses balance allocation and delists courses permissions'
    ],
    permissionRules: 'PCI-compliant architecture restricts raw card detail retention. Super Admins query overall financials.',
    adminControls: [
      'Trigger Refund Request - Reverses card transactions safely',
      'Disburse Commission Payments - Transfers processed revenues to verified instructor bank accounts'
    ],
    analyticsTracking: 'Tracks daily sales margins, monthly recurring revenues (MRR), cart bounce rates, and chargeback levels.',
    failureRecovery: 'Dual stripe-PayPal routing profiles automatically adjust to routing performance failures.',
    scalabilityStrategy: 'Asynchronous workers queue and process incoming webhook transaction streams.'
  },
  subscription: {
    id: 'subscription',
    name: 'Subscription Service',
    purpose: 'Manages recurring pricing models, corporate subscription rosters, billing cycles, and grace-period rules.',
    dbStructure: `CREATE TABLE subscription_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_slug VARCHAR(64) NOT NULL,
  cycle_status VARCHAR(64) DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE
);`,
    apiContracts: [
      'POST /api/v1/subscriptions/subscribe - Initialize recurring billing plans',
      'DELETE /api/v1/subscriptions/:id - Queue subscription cancel tasks'
    ],
    relationships: 'Restricts user profile accesses using plan status details.',
    eventsProduced: [
      'SubscriptionActivated - Emitted on valid payment completions',
      'SubscriptionTrialExpired - Triggers notification updates to paywall views',
      'SubscriptionBillingFailed - Alerts support to initiate recovery dunning efforts'
    ],
    eventsConsumed: [
      'PaymentSucceeded - Extends active subscription cycle access times'
    ],
    permissionRules: 'Casbin guards; users update own tier selections; admins control overall plan parameters.',
    adminControls: [
      'Grant Plan Tier Overrides - Manually upgrades target accounts',
      'Pause Billing System Cycles - Pauses subscription checks amidst regional payment issues'
    ],
    analyticsTracking: 'Measures lifetime values (LTV), customer churn metrics, subscription tier changes, and monthly dunning recovery rates.',
    failureRecovery: 'Stores local copies of billing sessions to prevent user drop-out when external payment services fail.',
    scalabilityStrategy: 'Uses Redis caches for quick active-subscription validations.'
  },
  instructor: {
    id: 'instructor',
    name: 'Instructor Service',
    purpose: 'Manages instructor onboarding, KYC documentation checks, payout percentages, performance parameters, and agreement logs.',
    dbStructure: `CREATE TABLE tutor_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  country_code VARCHAR(8),
  kyc_file_url VARCHAR(512),
  tax_identifier VARCHAR(128),
  agreement_signed BOOLEAN DEFAULT FALSE,
  overall_rating NUMERIC(3,2) DEFAULT 5.0
);`,
    apiContracts: [
      'POST /api/v1/instructors/apply - Submit primary application and tax documents',
      'GET /api/v1/instructors/:id/score - Evaluate tutor quality levels'
    ],
    relationships: 'Links Courses with Instructor profiles; relates directly to Payout channels.',
    eventsProduced: [
      'InstructorKycApproved - Triggers course publishing capabilities',
      'ContractAgreementUpdated - Requests signature reviews from active tutors'
    ],
    eventsConsumed: [
      'PaymentSucceeded - Computes specific commission-split ledger transactions'
    ],
    permissionRules: 'Only Super Admins adjust contract items, and approve/suspend onboarding candidates.',
    adminControls: [
      'Review Identity Documents - Fully audits identity uploads',
      'Modify Revenue Share Percentage - Customizes commission splits for top-performing partners'
    ],
    analyticsTracking: 'Monitors onboarding speeds, overall instructor ratings, payouts volume, and retention rate metrics.',
    failureRecovery: 'Dual storage backup system protects onboarding contracts and identity records.',
    scalabilityStrategy: 'Highly available document-storage CDN routes incoming contract check flows.'
  },
  affiliate: {
    id: 'affiliate',
    name: 'Affiliate Service',
    purpose: 'Enforces referral link tracking, computes affiliate payouts, verifies promo code use, and handles tracking cookies.',
    dbStructure: `CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promoter_user_id UUID NOT NULL,
  custom_slug VARCHAR(64) UNIQUE,
  commission_ratio NUMERIC(5,2) DEFAULT 10.0,
  total_conversions INT DEFAULT 0
);`,
    apiContracts: [
      'POST /api/v1/affiliates/register - Setup custom promotional tags',
      'GET /api/v1/affiliates/payouts/pending - Calculate affiliate allocations'
    ],
    relationships: 'Processes referral codes during user checkouts within the Payment Service.',
    eventsProduced: [
      'ReferralConversionCreated - Emitted when purchases complete via promoters',
      'ReferralCommissionSettled - Initiates payout transactions to promotors'
    ],
    eventsConsumed: [
      'PaymentSucceeded - Validates and processes the referral cookie fields'
    ],
    permissionRules: 'Enforced dynamically; users read individual commissions; administrative teams manage promo definitions.',
    adminControls: [
      'Block Custom Affiliate Slugs - Delists fraudulent promotional channels',
      'Optimize Referral Commission Split - Adjusts payout percentages for marketing campaigns'
    ],
    analyticsTracking: 'Tracks total referral conversions, active promoter metrics, and cost per acquisition (CPA).',
    failureRecovery: 'Resilient tracking systems record cookie assignments even during sudden payment failures.',
    scalabilityStrategy: 'Highly cached slug redirects on edge server routes process affiliate pathways rapidly.'
  },
  community: {
    id: 'community',
    name: 'Community Service',
    purpose: 'Handles discussion channels, community forums, mentorship groups, message posts, and reactions.',
    dbStructure: `CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_slug VARCHAR(128) INDEX,
  creator_id UUID NOT NULL,
  post_title VARCHAR(512),
  post_body TEXT,
  toxicity_score NUMERIC(5,2)
);

CREATE TABLE post_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL,
  response_body TEXT
);`,
    apiContracts: [
      'POST /api/v1/community/threads - Create study group discourse threads',
      'POST /api/v1/community/threads/:id/comment - Post response strings'
    ],
    relationships: 'Tracks student participation and relates directly to Moderation services.',
    eventsProduced: [
      'CommunityPostSubmitted - Triggers real-time safety classification sweeps',
      'StudentGroupMentioned - Dispatches real-time updates'
    ],
    eventsConsumed: [
      'PostPurged - System cleans up database records instantly'
    ],
    permissionRules: 'Enrolled students post within specific course channels; moderators handle cleanup.',
    adminControls: [
      'Quarantine Forum Topic - Locks threads to investigate complaints',
      'Mute Classroom Discussion - Restricts user contributions to read-only status'
    ],
    analyticsTracking: 'Measures weekly comment frequencies, daily student conversation levels, and sentiment indices.',
    failureRecovery: 'Dual database replication keeps discuss feeds readable during peak forum traffic spikes.',
    scalabilityStrategy: 'Forum lists are cached using memory stores to reduce database query loads.'
  },
  notification: {
    id: 'notification',
    name: 'Notification Service',
    purpose: 'Distributes in-app alerts, direct SMS, WhatsApp templates, and transactional emails across global system endpoints.',
    dbStructure: `CREATE TABLE direct_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_user_id UUID NOT NULL INDEX,
  channel_type VARCHAR(64) NOT NULL,
  payload_content JSONB NOT NULL,
  dispatch_state VARCHAR(64) DEFAULT 'pending',
  retry_count INT DEFAULT 0
);`,
    apiContracts: [
      'POST /api/v1/notifications/push - Queue real-time system alerts',
      'POST /api/v1/notifications/sms/whatsapp - Enforce priority dispatch tasks'
    ],
    relationships: 'Acts as the outward communication bridge for all microservices.',
    eventsProduced: [
      'AlertDelivered - Logged upon successful messaging receipts'
    ],
    eventsConsumed: [
      'PaymentSucceeded - Dispatches invoicing emails to purchasers',
      'LiveClassChannelOpened - Triggers real-time broadcast alerts'
    ],
    permissionRules: 'Internal routing system limits API access exclusively to trusted service-to-service networks.',
    adminControls: [
      'Dispatch Global System Announcement - Sends urgent service notifications',
      'Pause Notification Dispatch Queues - Suspends marketing sends during server maintenance window'
    ],
    analyticsTracking: 'Measures message opens, SMS delivery success rates, and contact unsubscribes.',
    failureRecovery: 'Asynchronous retry queues with exponential backoff handle external API dropouts.',
    scalabilityStrategy: 'Distributed queue systems manage high messaging throughput efficiently.'
  },
  support: {
    id: 'support',
    name: 'Support Service',
    purpose: 'Manages support tickets, coordinates live chat, sets target SLAs, and runs the institutional knowledge base.',
    dbStructure: `CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_user_id UUID NOT NULL,
  priority_tier VARCHAR(64) DEFAULT 'medium',
  ticket_subject VARCHAR(255),
  ticket_status VARCHAR(64) DEFAULT 'open',
  handler_agent_id UUID,
  sla_deadline TIMESTAMP WITH TIME ZONE
);`,
    apiContracts: [
      'POST /api/v1/tickets - Create fresh customer support records',
      'PUT /api/v1/tickets/:id/resolve - Mark assistance issues resolved'
    ],
    relationships: 'Identifies core users and connects past order records directly to customer support agent screens.',
    eventsProduced: [
      'SupportTicketCreated - Dispatches confirmation emails to students',
      'SlaDeadlineApproaching - Automatically increases ticket urgency scores'
    ],
    eventsConsumed: [],
    permissionRules: 'Students manage own tickets; agents access full routing lists; managers control SLA parameters.',
    adminControls: [
      'Reassign Ticket Agent - Routes complex technical queries to specialized engineers',
      'Adjust SLA Guidelines - Modifies resolution response times for high-priority tiers'
    ],
    analyticsTracking: 'Tracks average initial response times, customer satisfaction levels (CSAT), and ticket volumes.',
    failureRecovery: 'External webhook notifications push support requests to backup servers during outages.',
    scalabilityStrategy: 'Intelligent routing rules match incoming requests to available customer support agents automatically.'
  },
  ai: {
    id: 'ai',
    name: 'AI Service',
    purpose: 'Powers chatbot learning tutors, auto-grades coding assessments, builds custom courses, translates content, and tracks AI token usage.',
    dbStructure: `CREATE TABLE ai_inference_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_user_id UUID NOT NULL,
  model_slug VARCHAR(128) NOT NULL,
  system_instructions TEXT,
  prompt_input TEXT,
  output_text TEXT,
  input_tokens INT,
  output_tokens INT,
  execution_cost NUMERIC(10,8)
);`,
    apiContracts: [
      'POST /api/v1/ai/tutor/chat - Session-based tutoring conversations',
      'POST /api/v1/ai/curriculum/generate - Auto-create lesson outlines using Sankalp AI models'
    ],
    relationships: 'Assists educators in the Curriculum Service and students in discussion threads.',
    eventsProduced: [
      'InferenceCompleted - Logs session token consumption'
    ],
    eventsConsumed: [],
    permissionRules: 'Limits requests via dynamic token buckets per user tier.',
    adminControls: [
      'Optimize AI System Prompts - Adjusts primary system instructions for chatbot agents',
      'View Real-time API Logs - Audits raw query-response trails'
    ],
    analyticsTracking: 'Tracks query response latencies, token consumption, task categories, and token expense indexes.',
    failureRecovery: 'Graceful fallback systems switch tasks to faster models during token-limit bottlenecks.',
    scalabilityStrategy: 'Asynchronous inference workflows decouple large generative tasks from main browser screens.'
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics Service',
    purpose: 'Aggregates massive event streams, tracks customer retention cohorts, measures course completion rates, and processes predictive models.',
    dbStructure: `CREATE TABLE aggregate_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_bucket TIMESTAMP WITH TIME ZONE INDEX,
  metric_key VARCHAR(128) NOT NULL,
  metric_value NUMERIC(15,4)
);`,
    apiContracts: [
      'POST /api/v1/analytics/events - Single-destination event collectors',
      'GET /api/v1/analytics/retention - Calculate cohort details'
    ],
    relationships: 'Processes transaction logs from all other system services.',
    eventsProduced: [
      'PerformanceBenchmarkReached - Emitted when conversion targets are met'
    ],
    eventsConsumed: [
      '* - Subscribes to all platform events for high-volume storage in the analytics database'
    ],
    permissionRules: 'Strictly restricted; access to executive dashboards is gated behind Super Admin or Executive permissions.',
    adminControls: [
      'Rebuild Analytical Buckets - Cleans and compiles historical logs',
      'Configure Goal Funnels - Defines progress landmarks for tracking'
    ],
    analyticsTracking: 'Tracks platform metrics and processes performance data continuously.',
    failureRecovery: 'Utilizes high-capacity buffer queues to prevent data loss during massive log-writing spikes.',
    scalabilityStrategy: 'Analytical processing is isolated from the main database to preserve application speed.'
  },
  search: {
    id: 'search',
    name: 'Search Service',
    purpose: 'Provides full-text and vector calculations, maps semantic searches to course lists, and indexes directory files.',
    dbStructure: `CREATE TABLE search_index_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_version_hash VARCHAR(64),
  entity_indexed VARCHAR(128),
  last_indexed_at TIMESTAMP WITH TIME ZONE
);`,
    apiContracts: [
      'GET /api/v1/search - Matches keywords to user directory, courses, support logs, and forum entries',
      'POST /api/v1/search/refresh - Triggers search indexing tasks manual'
    ],
    relationships: 'Maintains catalog searches of Courses, Users, and Community systems.',
    eventsProduced: [],
    eventsConsumed: [
      'CoursePublished - Updates course indexes',
      'UserProfileUpdated - Updates directory list profiles'
    ],
    permissionRules: 'Public searching limits visibility to active, non-archived materials; administrative indices require specific permissions.',
    adminControls: [
      'Re-index Catalog - Forces fresh index compilations',
      'Set Search Boost Parameters - Highlights specific course subjects in search listings'
    ],
    analyticsTracking: 'Analyzes popular search phrases, zero-result terms, and click-through metrics.',
    failureRecovery: 'Automatic redirection routes search traffic to secondary fallback nodes if search indexes crash.',
    scalabilityStrategy: 'Horizontal scaling handles search indexing workloads efficiently.'
  },
  audit: {
    id: 'audit',
    name: 'Audit Service',
    purpose: 'Maintains fully secure system audit logs of all configuration adjustments, credential edits, and payment modifications.',
    dbStructure: `CREATE TABLE cluster_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NOT NULL INDEX,
  action_performed VARCHAR(255) NOT NULL,
  target_resource VARCHAR(255) NOT NULL,
  previous_state JSONB,
  subsequent_state JSONB,
  origin_ip VARCHAR(64),
  log_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    apiContracts: [
      'GET /api/v1/audit/logs - Retrieve secure historical logs'
    ],
    relationships: 'Documents modification logs from the system control panels.',
    eventsProduced: [],
    eventsConsumed: [
      '* - Listens to and records major configuration state changes'
    ],
    permissionRules: 'Read-only storage patterns. Access restricted exclusively to Super Admins and Compliance Officers.',
    adminControls: [
      'Export Certified Audit CSV - Generates secure system modification files',
      'Verify DB State Hashes - Secures logs against tampering'
    ],
    analyticsTracking: 'Monitors administrator activity rates and flags unexpected privilege changes.',
    failureRecovery: 'Continuous secondary replication preserves audit integrity against file corruption or system crashes.',
    scalabilityStrategy: 'Writes audit logs to highly performant write-only storage blocks.'
  },
  org: {
    id: 'org',
    name: 'Organization Service',
    purpose: 'Handles corporate logins, supports multi-tenant SaaS branding, organizes employee lists, and coordinates organization-wide billing.',
    dbStructure: `CREATE TABLE partner_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_slug VARCHAR(128) UNIQUE INDEX,
  company_name VARCHAR(255) NOT NULL,
  custom_domain VARCHAR(255) UNIQUE,
  white_label_layout JSONB DEFAULT '{}',
  invoice_quota_limit NUMERIC(12,2)
);

CREATE TABLE enterprise_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES partner_organizations(id) ON DELETE CASCADE,
  employee_user_id UUID UNIQUE,
  division_name VARCHAR(128)
);`,
    apiContracts: [
      'POST /api/v1/orgs - Define new white-label tenant workspaces',
      'POST /api/v1/orgs/:id/assets - Setup custom branding and favicon assets'
    ],
    relationships: 'Maps distinct user group directories to proprietary white-label views.',
    eventsProduced: [
      'OrganizationWorkspaceCreated - Deploys unique routing rules to gateways',
      'QuotaThresholdBreached - Warns administrators of organizational seat limits'
    ],
    eventsConsumed: [],
    permissionRules: 'Gated access; Organization Admins manage corporate users; Super Admins control global instances.',
    adminControls: [
      'Activate Domain Mapping - Points custom URLs to white-label layouts',
      'Configure Invoice Limits - Adjusts training budgets for corporate partners'
    ],
    analyticsTracking: 'Tracks daily employer usage stats, seat usage percentages, and enterprise revenues.',
    failureRecovery: 'Robust cloud-storage setups preserve corporate assets and database settings.',
    scalabilityStrategy: 'Automated namespace assignments segment customer data paths efficiently.'
  },
  marketplace: {
    id: 'marketplace',
    name: 'Marketplace Service',
    purpose: 'Coordinates promotional course paths, handles bundles, runs review listings, and manages gift card codes.',
    dbStructure: `CREATE TABLE product_catalogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_bundle_slug VARCHAR(128),
  discounted_items JSONB,
  gift_voucher_key VARCHAR(128)
);`,
    apiContracts: [
      'GET /api/v1/marketplace/bundles - Pull list of promotional catalog collections',
      'POST /api/v1/marketplace/vouchers - Set active discount terms'
    ],
    relationships: 'Integrates with Course files and feeds promotional codes into Payment gateways.',
    eventsProduced: [
      'CatalogPromotionCreated - Alerts marketing pipelines of new promotional offers'
    ],
    eventsConsumed: [],
    permissionRules: 'Allows public catalog lookups; writes are restricted to authorized marketing teams.',
    adminControls: [
      'Deactivate Promotion Code - Ends active discounts immediately',
      'Pin Catalog Item - High-visibility layout prioritization'
    ],
    analyticsTracking: 'Measures bundle purchase histories, review counts, and catalog visual engagements.',
    failureRecovery: 'Active localized caches preserve catalog listings even during main server slowdowns.',
    scalabilityStrategy: 'Catalog data is distributed across regional CDNs to ensure fast global image loading.'
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing Service',
    purpose: 'Runs email campaigns, targets promotional lists, performs A/B layout experiments, and tracks conversion funnels.',
    dbStructure: `CREATE TABLE sales_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_slug VARCHAR(128) NOT NULL,
  funnel_variant_tag VARCHAR(16),
  aggregate_views INT DEFAULT 0,
  aggregate_signups INT DEFAULT 0
);`,
    apiContracts: [
      'POST /api/v1/marketing/campaigns - Dispatched targeted email campaigns',
      'GET /api/v1/marketing/funnels/conversions - Calculate dynamic sales funnel conversions'
    ],
    relationships: 'Monitors incoming user signups and links them to marketing campaign sources.',
    eventsProduced: [
      'MarketingAbTestVariantAssigned - Tracks conversion rates or user behaviors'
    ],
    eventsConsumed: [
      'UserRegistered - Updates conversion attribution metrics'
    ],
    permissionRules: 'Writes are restricted to marketing administrators and platform builders.',
    adminControls: [
      'Launch Newsletter - Initiates marketing broadcasts',
      'Force A/B Test Variations - Manually sets layout layouts for user groups'
    ],
    analyticsTracking: 'Tracks email conversion percentages, campaign ROI, and customer cost-per-acquisition (CPA).',
    failureRecovery: 'Reliable third-party email webhooks preserve newsletter lists during server interruptions.',
    scalabilityStrategy: 'Decoupling campaign execution logic from core server paths preserves runtime performance.'
  },
  automation: {
    id: 'automation',
    name: 'Automation Service',
    purpose: 'Coordinates automatic systems workflows, evaluates dynamic trigger policies, and dispatches cascading operations.',
    dbStructure: `CREATE TABLE active_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_event VARCHAR(128) INDEX,
  evaluation_condition TEXT,
  target_expression JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);`,
    apiContracts: [
      'POST /api/v1/automation/pipelines - Define conditional system trigger logic',
      'DELETE /api/v1/automation/pipelines/:id - Disable active automation rules'
    ],
    relationships: 'Listens to events from all services and triggers targeted response actions.',
    eventsProduced: [
      'AutomationFlowCompleted - Confirms successful execution of triggers'
    ],
    eventsConsumed: [
      '* - Evaluates dynamic routing choices based on incoming event types'
    ],
    permissionRules: 'Strictly locked; config controls are gated behind Admin or Super Admin permissions.',
    adminControls: [
      'Execute Manual Workflow - Overrides delays to test trigger sequences',
      'Query Performance History - Audits system execution loops'
    ],
    analyticsTracking: 'Monitors total runs, task execution paths, and average script response times.',
    failureRecovery: 'Reliable step-logging systems preserve pending tasks to prevent event losses.',
    scalabilityStrategy: 'Workflows scale out to handle variable trigger volumes effectively.'
  },
  infrastructure: {
    id: 'infrastructure',
    name: 'Infrastructure Service',
    purpose: 'Coordinates server configurations, handles CDN routing, manages domain registration systems, and monitors databases.',
    dbStructure: `CREATE TABLE cluster_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_name VARCHAR(128) NOT NULL,
  ingress_routing_definition JSONBProps,
  ssl_certificates_status VARCHAR(64)
);`,
    apiContracts: [
      'POST /api/v1/infra/redeploy - Execute cluster deployments',
      'GET /api/v1/infra/provision/dns - Configure custom domains and SSL profiles'
    ],
    relationships: 'Organizes system settings and manages base container environments.',
    eventsProduced: [
      'ClusterScalingInitiated - Notifies monitoring team of sudden instance scaling'
    ],
    eventsConsumed: [],
    permissionRules: 'Strictly restricted; access to system configurations is limited to Super Admins.',
    adminControls: [
      'Launch Blue/Green Deployment - Executes rolling, zero-downtime updates',
      'Clear Edge Routing Cache - Flushes global CDN caches'
    ],
    analyticsTracking: 'Monitors container response limits and charts database write queues.',
    failureRecovery: 'Active backup servers deploy automatically during server-failure incidents.',
    scalabilityStrategy: 'Dynamic container orchestrations auto-scale resource limits based on platform load.'
  },
  monitoring: {
    id: 'monitoring',
    name: 'Monitoring Service',
    purpose: 'Audits resource health metrics, monitors database connections, aggregates error traces, and tracks bandwidth consumption.',
    dbStructure: `CREATE TABLE diagnostic_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_node_id VARCHAR(128),
  cpu_utilization NUMERIC(5,2),
  ram_bytes_free BIGINT,
  db_connections_active INT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
    apiContracts: [
      'GET /api/v1/monitoring/health - Public health check APIs',
      'GET /api/v1/monitoring/logs - Aggregate real-time server logging systems'
    ],
    relationships: 'Observes running processes across all active systems.',
    eventsProduced: [
      'ResourceThresholdExceeded - Dispatches urgent alerts to platform engineers'
    ],
    eventsConsumed: [],
    permissionRules: 'Access to system monitoring views is restricted to platform engineering and Super Admins.',
    adminControls: [
      'Force Container Reboot - Triggers immediate node restarts',
      'Modify Alert Limits - Enhances alerting sensitivity for high-traffic events'
    ],
    analyticsTracking: 'Measures average server response times (p99), system uptime, and API errors.',
    failureRecovery: 'Independent monitoring networks ensure alerting remains functional during main database issues.',
    scalabilityStrategy: 'Optimized time-series databases handle metrics storage efficiently.'
  },
  compliance: {
    id: 'compliance',
    name: 'Compliance Service',
    purpose: 'Manages user private data settings, handles cookie consents, and runs right-to-be-forgotten deletion workflows.',
    dbStructure: `CREATE TABLE privacy_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL INDEX,
  consent_manifest JSONB,
  archival_hash VARCHAR(128)
);`,
    apiContracts: [
      'POST /api/v1/compliance/gdrp/erase - Register right-to-be-forgotten deletion requests',
      'GET /api/v1/compliance/audits - Query log verification checklists'
    ],
    relationships: 'Coordinates secure user data purging with the User and Auth services.',
    eventsProduced: [
      'GdprErasureCompleted - Signals services to scratch user session records'
    ],
    eventsConsumed: [],
    permissionRules: 'Requires explicit security authorization checks. Accessible only by Compliance Officers.',
    adminControls: [
      'Analyze Privacy Risks - Scans files for exposed plain text personal record fields',
      'Authorize Complete Erasure - Initiates permanent user deletion workflows'
    ],
    analyticsTracking: 'Tracks privacy consent histories and processes legal deletion turn-around times.',
    failureRecovery: 'Isolated, highly secure offline backups protect privacy and consent compliance records.',
    scalabilityStrategy: 'Independent server processing ensures zero slowdown on critical user-facing databases.'
  }
};
