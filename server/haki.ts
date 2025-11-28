/**
 * Haki System Helper
 * Manages gamification points and user ranks
 */

import { getDb } from "./db";
import { hakiEvents, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TelegramTemplates } from "./telegram";

export interface UserRank {
  haki: number;
  title: string;
  aura: string;
}

/**
 * Get user rank based on Haki score
 */
export function getRank(score: number): UserRank {
  if (score > 5000) return { haki: score, title: 'PIRATE KING', aura: '#fbbf24' }; // Gold
  if (score > 2500) return { haki: score, title: 'YONKO', aura: '#dc2626' }; // Red
  if (score > 1000) return { haki: score, title: 'WARLORD', aura: '#7c3aed' }; // Violet
  if (score > 500) return { haki: score, title: 'SUPERNOVA', aura: '#06b6d4' }; // Cyan
  if (score > 100) return { haki: score, title: 'PIRATE', aura: '#10b981' }; // Emerald
  return { haki: score, title: 'CHORE BOY', aura: '#64748b' }; // Slate
}

/**
 * Haki point values for different actions
 */
export const HakiPoints = {
  WALLET_CONNECT: 50,
  WAITLIST_JOIN: 30,
  TAPE_LOAD: 5,
  TAPE_CREATE: 20,
  TAPE_APPROVED: 100,
  VOTE: 2,
  CHAT_MESSAGE: 1,
  DAILY_LOGIN: 10,
  SHARE: 15,
};

/**
 * Haki milestone thresholds for notifications
 */
const HAKI_MILESTONES = [100, 500, 1000, 2500, 5000];

/**
 * Award Haki points to a user
 */
export async function awardHaki(
  userId: number,
  eventType: string,
  points: number,
  metadata?: Record<string, any>
): Promise<{ newScore: number; newRank: UserRank; milestoneReached: boolean }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get current user data
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new Error("User not found");

  const oldScore = user.hakiScore;
  const newScore = oldScore + points;
  const oldRank = getRank(oldScore);
  const newRank = getRank(newScore);

  // Update user's Haki score
  await db.update(users)
    .set({ hakiScore: newScore })
    .where(eq(users.id, userId));

  // Log Haki event
  await db.insert(hakiEvents).values({
    userId,
    eventType,
    points,
    metadata: metadata ? JSON.stringify(metadata) : null,
  });

  // Check if milestone reached
  const milestoneReached = HAKI_MILESTONES.some(
    milestone => oldScore < milestone && newScore >= milestone
  );

  // Send Telegram notification if rank changed or milestone reached
  if (oldRank.title !== newRank.title || milestoneReached) {
    await TelegramTemplates.hakiMilestone(
      user.walletAddress || user.email || `User ${userId}`,
      newScore,
      newRank.title
    );
  }

  return { newScore, newRank, milestoneReached };
}

/**
 * Get user's Haki history
 */
export async function getHakiHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(hakiEvents)
    .where(eq(hakiEvents.userId, userId))
    .orderBy(hakiEvents.createdAt)
    .limit(limit);
}

/**
 * Get leaderboard (top users by Haki)
 */
export async function getHakiLeaderboard(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: users.id,
      name: users.name,
      walletAddress: users.walletAddress,
      hakiScore: users.hakiScore,
    })
    .from(users)
    .orderBy(users.hakiScore)
    .limit(limit);
}
