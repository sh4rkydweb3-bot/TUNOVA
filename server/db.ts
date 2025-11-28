import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tapes, contactRequests, analyticsEvents, InsertTape, InsertContactRequest, InsertAnalyticsEvent } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "walletAddress", "discordHandle", "twitterHandle", "waitlistRoles"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.hakiScore !== undefined) {
      values.hakiScore = user.hakiScore;
      updateSet.hakiScore = user.hakiScore;
    }
    if (user.isInWaitlist !== undefined) {
      values.isInWaitlist = user.isInWaitlist;
      updateSet.isInWaitlist = user.isInWaitlist;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByWallet(walletAddress: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserWallet(userId: number, walletAddress: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ walletAddress }).where(eq(users.id, userId));
}

export async function updateUserHaki(userId: number, hakiScore: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ hakiScore }).where(eq(users.id, userId));
}

export async function joinWaitlist(userId: number, roles: string[], discord?: string, twitter?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({
    isInWaitlist: 1,
    waitlistRoles: JSON.stringify(roles),
    discordHandle: discord || null,
    twitterHandle: twitter || null,
  }).where(eq(users.id, userId));
}

// === TAPES ===

export async function createTape(tape: InsertTape) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(tapes).values(tape);
  return result;
}

export async function getTapesByStatus(status: "draft" | "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(tapes).where(eq(tapes.status, status)).orderBy(tapes.createdAt);
}

export async function getTapesByCreator(creatorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(tapes).where(eq(tapes.creatorId, creatorId)).orderBy(tapes.createdAt);
}

export async function updateTapeStatus(
  tapeId: number,
  status: "approved" | "rejected",
  reviewedBy: number,
  reviewNote?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(tapes).set({
    status,
    reviewedBy,
    reviewNote,
    reviewedAt: new Date(),
  }).where(eq(tapes.id, tapeId));
}

// === CONTACT REQUESTS ===

export async function createContactRequest(request: InsertContactRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contactRequests).values(request);
  return result;
}

export async function getPendingContactRequests() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contactRequests).where(eq(contactRequests.status, "pending")).orderBy(contactRequests.createdAt);
}

export async function updateContactRequestStatus(
  requestId: number,
  status: "approved" | "rejected",
  approvedBy: number,
  contactMethod?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contactRequests).set({
    status,
    approvedBy,
    contactMethod,
    reviewedAt: new Date(),
  }).where(eq(contactRequests.id, requestId));
}

// === ANALYTICS ===

export async function logAnalyticsEvent(event: InsertAnalyticsEvent) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(analyticsEvents).values(event);
  } catch (error) {
    console.error("[Analytics] Failed to log event:", error);
  }
}

export async function getAnalyticsByType(eventType: string, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(analyticsEvents).where(eq(analyticsEvents.eventType, eventType)).orderBy(analyticsEvents.createdAt).limit(limit);
}
