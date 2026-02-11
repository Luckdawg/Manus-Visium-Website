import { mysqlTable, int, varchar, text, boolean, timestamp, mysqlEnum, decimal, index } from "drizzle-orm/mysql-core";

/**
 * Training Courses - Main course catalog
 */
export const trainingCourses = mysqlTable("training_courses", {
  id: int("id").autoincrement().primaryKey(),
  
  // Course metadata
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  
  // Course structure
  category: mysqlEnum("category", [
    "Sales",
    "Technical",
    "Solutions Architecture",
    "Product Knowledge",
    "Partner Management",
    "Compliance",
    "Other"
  ]).notNull(),
  
  level: mysqlEnum("level", [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert"
  ]).default("Beginner").notNull(),
  
  // Duration and content
  durationMinutes: int("durationMinutes").notNull(),
  contentType: mysqlEnum("contentType", [
    "Video",
    "Document",
    "Interactive",
    "Assessment",
    "Live Session",
    "Hybrid"
  ]).notNull(),
  
  // Content storage
  contentUrl: varchar("contentUrl", { length: 512 }),
  contentEmbedCode: text("contentEmbedCode"),
  
  // Certification
  isCertifiable: boolean("isCertifiable").default(false),
  passingScore: int("passingScore").default(70),
  certificationName: varchar("certificationName", { length: 255 }),
  certificationExpiryMonths: int("certificationExpiryMonths"),
  
  // Status
  isPublished: boolean("isPublished").default(false),
  isActive: boolean("isActive").default(true),
  
  // Metadata
  createdBy: int("createdBy").notNull(),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("category_idx").on(table.category),
  levelIdx: index("level_idx").on(table.level),
  slugIdx: index("slug_idx").on(table.slug),
  publishedIdx: index("published_idx").on(table.isPublished),
}));

export type TrainingCourse = typeof trainingCourses.$inferSelect;
export type InsertTrainingCourse = typeof trainingCourses.$inferInsert;

/**
 * Learning Paths - Curated sequences of courses
 */
export const learningPaths = mysqlTable("learning_paths", {
  id: int("id").autoincrement().primaryKey(),
  
  // Path metadata
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  
  // Path type
  pathType: mysqlEnum("pathType", [
    "Sales",
    "Technical",
    "Executive",
    "Compliance",
    "Onboarding",
    "Custom"
  ]).notNull(),
  
  // Courses in path (stored as JSON array of course IDs)
  courseIds: text("courseIds").notNull(), // JSON array: [1, 2, 3, ...]
  
  // Sequencing
  isSequential: boolean("isSequential").default(true),
  estimatedHours: decimal("estimatedHours", { precision: 5, scale: 2 }),
  
  // Certification
  awardsCertification: boolean("awardsCertification").default(false),
  certificationName: varchar("certificationName", { length: 255 }),
  
  // Status
  isPublished: boolean("isPublished").default(false),
  isActive: boolean("isActive").default(true),
  
  // Metadata
  createdBy: int("createdBy").notNull(),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("type_idx").on(table.pathType),
  publishedIdx: index("published_idx").on(table.isPublished),
}));

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = typeof learningPaths.$inferInsert;

/**
 * Partner Course Enrollments - Track partner progress through courses
 */
export const partnerCourseEnrollments = mysqlTable("partner_course_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  
  // References
  partnerCompanyId: int("partnerCompanyId").notNull(),
  partnerUserId: int("partnerUserId").notNull(),
  courseId: int("courseId").notNull(),
  
  // Progress tracking
  enrollmentStatus: mysqlEnum("enrollmentStatus", [
    "Enrolled",
    "In Progress",
    "Completed",
    "Failed",
    "Expired"
  ]).default("Enrolled").notNull(),
  
  progressPercentage: int("progressPercentage").default(0),
  lastAccessedAt: timestamp("lastAccessedAt"),
  
  // Assessment results
  assessmentScore: int("assessmentScore"),
  assessmentPassed: boolean("assessmentPassed"),
  assessmentAttempts: int("assessmentAttempts").default(0),
  assessmentCompletedAt: timestamp("assessmentCompletedAt"),
  
  // Certification
  certificateIssued: boolean("certificateIssued").default(false),
  certificateUrl: varchar("certificateUrl", { length: 512 }),
  certificateExpiresAt: timestamp("certificateExpiresAt"),
  
  // Timestamps
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerCompanyIdx: index("partner_company_idx").on(table.partnerCompanyId),
  partnerUserIdx: index("partner_user_idx").on(table.partnerUserId),
  courseIdx: index("course_idx").on(table.courseId),
  statusIdx: index("status_idx").on(table.enrollmentStatus),
}));

export type PartnerCourseEnrollment = typeof partnerCourseEnrollments.$inferSelect;
export type InsertPartnerCourseEnrollment = typeof partnerCourseEnrollments.$inferInsert;

/**
 * Partner Learning Path Progress - Track progress through learning paths
 */
export const partnerLearningPathProgress = mysqlTable("partner_learning_path_progress", {
  id: int("id").autoincrement().primaryKey(),
  
  // References
  partnerCompanyId: int("partnerCompanyId").notNull(),
  partnerUserId: int("partnerUserId").notNull(),
  learningPathId: int("learningPathId").notNull(),
  
  // Progress tracking
  pathStatus: mysqlEnum("pathStatus", [
    "Not Started",
    "In Progress",
    "Completed",
    "Paused"
  ]).default("Not Started").notNull(),
  
  progressPercentage: int("progressPercentage").default(0),
  completedCourseIds: text("completedCourseIds").default("[]"), // JSON array
  
  // Certification
  pathCertificateIssued: boolean("pathCertificateIssued").default(false),
  pathCertificateUrl: varchar("pathCertificateUrl", { length: 512 }),
  pathCertificateExpiresAt: timestamp("pathCertificateExpiresAt"),
  
  // Timestamps
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerCompanyIdx: index("partner_company_idx").on(table.partnerCompanyId),
  partnerUserIdx: index("partner_user_idx").on(table.partnerUserId),
  pathIdx: index("path_idx").on(table.learningPathId),
  statusIdx: index("status_idx").on(table.pathStatus),
}));

export type PartnerLearningPathProgress = typeof partnerLearningPathProgress.$inferSelect;
export type InsertPartnerLearningPathProgress = typeof partnerLearningPathProgress.$inferInsert;

/**
 * Partner Certifications - Track active and expired certifications
 */
export const partnerCertifications = mysqlTable("partner_certifications", {
  id: int("id").autoincrement().primaryKey(),
  
  // References
  partnerCompanyId: int("partnerCompanyId").notNull(),
  partnerUserId: int("partnerUserId"),
  enrollmentId: int("enrollmentId"),
  
  // Certification details
  certificationName: varchar("certificationName", { length: 255 }).notNull(),
  certificationLevel: mysqlEnum("certificationLevel", [
    "Associate",
    "Professional",
    "Expert",
    "Master"
  ]).default("Professional").notNull(),
  
  // Validity
  issuedAt: timestamp("issuedAt").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  certificateUrl: varchar("certificateUrl", { length: 512 }),
  certificateNumber: varchar("certificateNumber", { length: 100 }).unique(),
  
  // Status
  status: mysqlEnum("status", [
    "Active",
    "Expired",
    "Revoked",
    "Suspended"
  ]).default("Active").notNull(),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerCompanyIdx: index("partner_company_idx").on(table.partnerCompanyId),
  partnerUserIdx: index("partner_user_idx").on(table.partnerUserId),
  statusIdx: index("status_idx").on(table.status),
  expiresIdx: index("expires_idx").on(table.expiresAt),
}));

export type PartnerCertification = typeof partnerCertifications.$inferSelect;
export type InsertPartnerCertification = typeof partnerCertifications.$inferInsert;

/**
 * Training Content Library - Store training assets and materials
 */
export const trainingContentLibrary = mysqlTable("training_content_library", {
  id: int("id").autoincrement().primaryKey(),
  
  // Content metadata
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  contentType: mysqlEnum("contentType", [
    "Sales Collateral",
    "Technical Documentation",
    "Case Study",
    "Presentation",
    "Video",
    "Template",
    "Whitepaper",
    "Guide",
    "Other"
  ]).notNull(),
  
  // Content storage
  fileUrl: varchar("fileUrl", { length: 512 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileMimeType: varchar("fileMimeType", { length: 100 }),
  fileSize: int("fileSize"),
  
  // Categorization
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array of tags
  
  // Access control
  accessLevel: mysqlEnum("accessLevel", [
    "Public",
    "Partner Only",
    "Tier Specific",
    "Restricted"
  ]).default("Partner Only").notNull(),
  
  allowedTiers: text("allowedTiers"), // JSON array: ["Gold", "Silver"]
  
  // Tracking
  downloadCount: int("downloadCount").default(0),
  lastDownloadedAt: timestamp("lastDownloadedAt"),
  
  // Status
  isActive: boolean("isActive").default(true),
  
  // Metadata
  createdBy: int("createdBy").notNull(),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("type_idx").on(table.contentType),
  categoryIdx: index("category_idx").on(table.category),
  accessIdx: index("access_idx").on(table.accessLevel),
}));

export type TrainingContentLibraryItem = typeof trainingContentLibrary.$inferSelect;
export type InsertTrainingContentLibraryItem = typeof trainingContentLibrary.$inferInsert;

/**
 * Training Events/Webinars - Schedule live training sessions
 */
export const trainingEvents = mysqlTable("training_events", {
  id: int("id").autoincrement().primaryKey(),
  
  // Event metadata
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Event details
  eventType: mysqlEnum("eventType", [
    "Webinar",
    "Workshop",
    "Hands-on Lab",
    "Q&A Session",
    "Office Hours",
    "Conference"
  ]).notNull(),
  
  // Scheduling
  scheduledStartAt: timestamp("scheduledStartAt").notNull(),
  scheduledEndAt: timestamp("scheduledEndAt").notNull(),
  timezone: varchar("timezone", { length: 50 }).default("UTC"),
  
  // Capacity
  maxAttendees: int("maxAttendees"),
  registeredCount: int("registeredCount").default(0),
  
  // Content
  instructorName: varchar("instructorName", { length: 255 }),
  instructorBio: text("instructorBio"),
  meetingUrl: varchar("meetingUrl", { length: 512 }),
  recordingUrl: varchar("recordingUrl", { length: 512 }),
  
  // Status
  status: mysqlEnum("status", [
    "Scheduled",
    "In Progress",
    "Completed",
    "Cancelled"
  ]).default("Scheduled").notNull(),
  
  // Metadata
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("type_idx").on(table.eventType),
  statusIdx: index("status_idx").on(table.status),
  startIdx: index("start_idx").on(table.scheduledStartAt),
}));

export type TrainingEvent = typeof trainingEvents.$inferSelect;
export type InsertTrainingEvent = typeof trainingEvents.$inferInsert;

/**
 * Training Event Registrations - Track who registered for events
 */
export const trainingEventRegistrations = mysqlTable("training_event_registrations", {
  id: int("id").autoincrement().primaryKey(),
  
  // References
  eventId: int("eventId").notNull(),
  partnerCompanyId: int("partnerCompanyId").notNull(),
  partnerUserId: int("partnerUserId").notNull(),
  
  // Registration status
  registrationStatus: mysqlEnum("registrationStatus", [
    "Registered",
    "Attended",
    "No-show",
    "Cancelled"
  ]).default("Registered").notNull(),
  
  // Attendance tracking
  attendedAt: timestamp("attendedAt"),
  attendanceDuration: int("attendanceDuration"), // in minutes
  
  // Feedback
  feedbackScore: int("feedbackScore"), // 1-5 rating
  feedbackComments: text("feedbackComments"),
  
  // Timestamps
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  eventIdx: index("event_idx").on(table.eventId),
  partnerCompanyIdx: index("partner_company_idx").on(table.partnerCompanyId),
  partnerUserIdx: index("partner_user_idx").on(table.partnerUserId),
  statusIdx: index("status_idx").on(table.registrationStatus),
}));

export type TrainingEventRegistration = typeof trainingEventRegistrations.$inferSelect;
export type InsertTrainingEventRegistration = typeof trainingEventRegistrations.$inferInsert;

/**
 * Partner Training Progress Dashboard - Aggregated view of partner training status
 */
export const partnerTrainingProgress = mysqlTable("partner_training_progress", {
  id: int("id").autoincrement().primaryKey(),
  
  // References
  partnerCompanyId: int("partnerCompanyId").notNull().unique(),
  
  // Overall progress
  totalCoursesEnrolled: int("totalCoursesEnrolled").default(0),
  totalCoursesCompleted: int("totalCoursesCompleted").default(0),
  overallProgressPercentage: int("overallProgressPercentage").default(0),
  
  // Certifications
  activeCertifications: int("activeCertifications").default(0),
  expiredCertifications: int("expiredCertifications").default(0),
  
  // Learning paths
  completedLearningPaths: int("completedLearningPaths").default(0),
  inProgressLearningPaths: int("inProgressLearningPaths").default(0),
  
  // Compliance
  complianceStatus: mysqlEnum("complianceStatus", [
    "Compliant",
    "At Risk",
    "Non-Compliant",
    "Pending"
  ]).default("Pending").notNull(),
  
  lastComplianceCheckAt: timestamp("lastComplianceCheckAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  partnerIdx: index("partner_idx").on(table.partnerCompanyId),
  complianceIdx: index("compliance_idx").on(table.complianceStatus),
}));

export type PartnerTrainingProgress = typeof partnerTrainingProgress.$inferSelect;
export type InsertPartnerTrainingProgress = typeof partnerTrainingProgress.$inferInsert;
