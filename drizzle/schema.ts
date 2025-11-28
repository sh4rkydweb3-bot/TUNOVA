import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Web3, Haki, and Waitlist features.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Web3 Wallet Address (optional, for users who connect wallet)
  walletAddress: varchar("walletAddress", { length: 42 }).unique(),
  // Haki Score (gamification points)
  hakiScore: int("hakiScore").default(10).notNull(),
  // Waitlist status
  isInWaitlist: int("isInWaitlist").default(0).notNull(), // 0 = no, 1 = yes
  waitlistRoles: text("waitlistRoles"), // JSON array of desired roles
  // Social links (optional)
  discordHandle: varchar("discordHandle", { length: 100 }),
  twitterHandle: varchar("twitterHandle", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tapes (VHS and Cassettes) created by users
 * Status: draft (private), pending (review), approved (public), rejected
 */
export const tapes = mysqlTable("tapes", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(), // Foreign key to users.id
  type: mysqlEnum("type", ["vhs", "cassette"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  creator: varchar("creator", { length: 100 }).notNull(), // Display name
  color: varchar("color", { length: 20 }).notNull(),
  tracks: text("tracks").notNull(), // JSON array of tracks
  status: mysqlEnum("status", ["draft", "pending", "approved", "rejected"]).default("draft").notNull(),
  reviewedBy: int("reviewedBy"), // Admin user ID who reviewed
  reviewNote: text("reviewNote"), // Reason for rejection or approval note
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export type Tape = typeof tapes.$inferSelect;
export type InsertTape = typeof tapes.$inferInsert;

/**
 * Haki Events - Track all actions that grant Haki points
 */
export const hakiEvents = mysqlTable("hakiEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(), // 'tape_load', 'vote', 'chat', 'tape_create', etc.
  points: int("points").notNull(),
  metadata: text("metadata"), // JSON with additional context
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HakiEvent = typeof hakiEvents.$inferSelect;
export type InsertHakiEvent = typeof hakiEvents.$inferInsert;

/**
 * Contact Requests - Users requesting direct contact with Captain
 */
export const contactRequests = mysqlTable("contactRequests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reason: text("reason").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  approvedBy: int("approvedBy"), // Admin ID
  contactMethod: varchar("contactMethod", { length: 200 }), // Discord, Telegram, Email
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = typeof contactRequests.$inferInsert;

/**
 * Analytics Events - Track all platform interactions
 */
export const analyticsEvents = mysqlTable("analyticsEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Nullable for anonymous events
  eventType: varchar("eventType", { length: 50 }).notNull(),
  eventData: text("eventData"), // JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;

/**
 * Community MIX - User-generated content (VHS, Cassettes, Boards)
 * Instant drop for waitlist NAKAMAS without review
 */
export const communityMix = mysqlTable("communityMix", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(), // Foreign key to users.id
  type: mysqlEnum("type", ["vhs", "cassette", "board"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  url: text("url"), // YouTube, Spotify, SoundCloud, etc.
  coverImage: text("coverImage"),
  tracks: text("tracks"), // JSON array for VHS/Cassette
  metadata: text("metadata"), // JSON object for additional data
  votes: int("votes").default(0).notNull(),
  views: int("views").default(0).notNull(),
  isInstantDrop: int("isInstantDrop").default(0).notNull(), // 1 = instant drop (waitlist), 0 = needs review
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityMix = typeof communityMix.$inferSelect;
export type InsertCommunityMix = typeof communityMix.$inferInsert;

/**
 * User Drop Quota - Track how many drops each user has used
 */
export const userDropQuota = mysqlTable("userDropQuota", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(), // Foreign key to users.id
  vhsUsed: int("vhsUsed").default(0).notNull(),
  cassetteUsed: int("cassetteUsed").default(0).notNull(),
  boardUsed: int("boardUsed").default(0).notNull(),
  vhsLimit: int("vhsLimit").default(1).notNull(),
  cassetteLimit: int("cassetteLimit").default(1).notNull(),
  boardLimit: int("boardLimit").default(1).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type UserDropQuota = typeof userDropQuota.$inferSelect;
export type InsertUserDropQuota = typeof userDropQuota.$inferInsert;

/**
 * Anti-Marina Violations - Track user violations
 */
export const violations = mysqlTable("violations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'spam', 'toxicity', 'bot', 'copyright'
  description: text("description"),
  severity: mysqlEnum("severity", ["warning", "minor", "major", "critical"]).default("minor").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Violation = typeof violations.$inferSelect;
export type InsertViolation = typeof violations.$inferInsert;

/**
 * User Bans - Track banned users
 */
export const bans = mysqlTable("bans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  reason: text("reason").notNull(),
  bannedBy: int("bannedBy").notNull(), // Admin ID
  banType: mysqlEnum("banType", ["temporary", "permanent"]).notNull(),
  expiresAt: timestamp("expiresAt"), // Null for permanent bans
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Ban = typeof bans.$inferSelect;
export type InsertBan = typeof bans.$inferInsert;

/**
 * Votes - Track user votes on community content
 */
export const votes = mysqlTable("votes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contentId: int("contentId").notNull(), // ID from communityMix
  contentType: varchar("contentType", { length: 20 }).notNull(), // 'vhs', 'cassette', 'board'
  voteType: mysqlEnum("voteType", ["upvote", "downvote"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Vote = typeof votes.$inferSelect;
export type InsertVote = typeof votes.$inferInsert;

/**
 * Comments - User comments on community content
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contentId: int("contentId").notNull(), // ID from communityMix
  contentType: varchar("contentType", { length: 20 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Skins - Available skins for customization
 */
export const skins = mysqlTable("skins", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: mysqlEnum("category", ["boombox", "vhs", "cassette", "background", "beatbunny"]).notNull(),
  previewImage: text("previewImage").notNull(),
  cssData: text("cssData"), // JSON with CSS variables
  hakiRequired: int("hakiRequired").default(0).notNull(),
  isExclusive: int("isExclusive").default(0).notNull(), // 1 = exclusive for early NAKAMAS
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Skin = typeof skins.$inferSelect;
export type InsertSkin = typeof skins.$inferInsert;

/**
 * User Skins - Track which skins each user has unlocked
 */
export const userSkins = mysqlTable("userSkins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  skinId: int("skinId").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserSkin = typeof userSkins.$inferSelect;
export type InsertUserSkin = typeof userSkins.$inferInsert;
