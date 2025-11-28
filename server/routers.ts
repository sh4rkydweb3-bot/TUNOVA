import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  updateUserWallet, 
  joinWaitlist, 
  createTape, 
  getTapesByStatus, 
  getTapesByCreator,
  updateTapeStatus,
  createContactRequest,
  getPendingContactRequests,
  updateContactRequestStatus,
  logAnalyticsEvent,
  getUserByWallet
} from "./db";
import { awardHaki, getRank, HakiPoints, getHakiHistory, getHakiLeaderboard } from "./haki";
import { TelegramTemplates } from "./telegram";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // === WEB3 & WALLET ===
  web3: router({
    connectWallet: protectedProcedure
      .input(z.object({ walletAddress: z.string().length(42) }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        
        // Check if wallet is already connected to another user
        const existingUser = await getUserByWallet(input.walletAddress);
        if (existingUser && existingUser.id !== userId) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This wallet is already connected to another account",
          });
        }

        // Update user's wallet
        await updateUserWallet(userId, input.walletAddress);

        // Award Haki for connecting wallet
        const { newScore, newRank } = await awardHaki(
          userId,
          "wallet_connect",
          HakiPoints.WALLET_CONNECT,
          { walletAddress: input.walletAddress }
        );

        // Send Telegram notification
        await TelegramTemplates.newUser(input.walletAddress, newScore);

        // Log analytics
        await logAnalyticsEvent({
          userId,
          eventType: "wallet_connected",
          eventData: JSON.stringify({ walletAddress: input.walletAddress }),
        });

        return { success: true, hakiScore: newScore, rank: newRank };
      }),

    disconnectWallet: protectedProcedure.mutation(async ({ ctx }) => {
      await updateUserWallet(ctx.user.id, "");
      return { success: true };
    }),
  }),

  // === WAITLIST ===
  waitlist: router({
    join: protectedProcedure
      .input(z.object({
        roles: z.array(z.string()).min(1),
        discord: z.string().optional(),
        twitter: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;

        // Join waitlist
        await joinWaitlist(userId, input.roles, input.discord, input.twitter);

        // Award Haki
        const { newScore, newRank } = await awardHaki(
          userId,
          "waitlist_join",
          HakiPoints.WAITLIST_JOIN,
          { roles: input.roles }
        );

        // Send Telegram notification
        await TelegramTemplates.waitlistJoin(
          ctx.user.walletAddress || ctx.user.email || `User ${userId}`,
          input.roles,
          input.discord,
          input.twitter
        );

        // Log analytics
        await logAnalyticsEvent({
          userId,
          eventType: "waitlist_joined",
          eventData: JSON.stringify(input),
        });

        return { success: true, hakiScore: newScore, rank: newRank };
      }),

    status: protectedProcedure.query(async ({ ctx }) => {
      return {
        isInWaitlist: ctx.user.isInWaitlist === 1,
        roles: ctx.user.waitlistRoles ? JSON.parse(ctx.user.waitlistRoles) : [],
        discord: ctx.user.discordHandle,
        twitter: ctx.user.twitterHandle,
      };
    }),
  }),

  // === HAKI SYSTEM ===
  haki: router({
    getMyScore: protectedProcedure.query(async ({ ctx }) => {
      const rank = getRank(ctx.user.hakiScore);
      return {
        score: ctx.user.hakiScore,
        rank: rank.title,
        aura: rank.aura,
      };
    }),

    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        return await getHakiHistory(ctx.user.id, input.limit);
      }),

    getLeaderboard: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        const users = await getHakiLeaderboard(input.limit);
        return users.map(u => ({
          name: u.name || "Anonymous",
          walletAddress: u.walletAddress,
          hakiScore: u.hakiScore,
          rank: getRank(u.hakiScore).title,
        }));
      }),

    awardPoints: protectedProcedure
      .input(z.object({
        eventType: z.string(),
        points: z.number(),
        metadata: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await awardHaki(
          ctx.user.id,
          input.eventType,
          input.points,
          input.metadata
        );
        return result;
      }),
  }),

  // === TAPES (VHS & CASSETTES) ===
  tapes: router({
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["vhs", "cassette"]),
        title: z.string().min(1).max(200),
        creator: z.string().min(1).max(100),
        color: z.string(),
        tracks: z.array(z.object({
          id: z.string(),
          title: z.string(),
          artist: z.string(),
          url: z.string(),
          type: z.enum(["youtube", "spotify", "soundcloud", "mp3"]),
          votes: z.number().default(0),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;

        // Create tape in draft status
        await createTape({
          creatorId: userId,
          type: input.type,
          title: input.title,
          creator: input.creator,
          color: input.color,
          tracks: JSON.stringify(input.tracks),
          status: "draft",
        });

        // Award Haki
        const { newScore, newRank } = await awardHaki(
          userId,
          "tape_create",
          HakiPoints.TAPE_CREATE,
          { type: input.type, title: input.title }
        );

        // Log analytics
        await logAnalyticsEvent({
          userId,
          eventType: "tape_created",
          eventData: JSON.stringify({ type: input.type, title: input.title }),
        });

        return { success: true, hakiScore: newScore, rank: newRank };
      }),

    submitForReview: protectedProcedure
      .input(z.object({ tapeId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        const tapes = await getTapesByCreator(userId);
        const tape = tapes.find(t => t.id === input.tapeId);

        if (!tape) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Tape not found" });
        }

        if (tape.status !== "draft") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Tape already submitted" });
        }

        // Update status to pending
        await updateTapeStatus(input.tapeId, "pending" as any, userId);

        // Send Telegram notification
        const tracks = JSON.parse(tape.tracks);
        await TelegramTemplates.tapeSubmitted(
          tape.creator,
          tape.type,
          tape.title,
          tracks.length
        );

        // Log analytics
        await logAnalyticsEvent({
          userId,
          eventType: "tape_submitted",
          eventData: JSON.stringify({ tapeId: input.tapeId, type: tape.type }),
        });

        return { success: true };
      }),

    getMyTapes: protectedProcedure.query(async ({ ctx }) => {
      const tapes = await getTapesByCreator(ctx.user.id);
      return tapes.map(t => ({
        ...t,
        tracks: JSON.parse(t.tracks),
      }));
    }),

    getApproved: publicProcedure.query(async () => {
      const tapes = await getTapesByStatus("approved");
      return tapes.map(t => ({
        ...t,
        tracks: JSON.parse(t.tracks),
      }));
    }),
  }),

  // === CONTACT REQUESTS ===
  contact: router({
    requestCaptain: protectedProcedure
      .input(z.object({ reason: z.string().min(10).max(500) }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;

        // Create contact request
        await createContactRequest({
          userId,
          reason: input.reason,
          status: "pending",
        });

        // Send Telegram notification
        await TelegramTemplates.contactRequest(
          ctx.user.walletAddress || ctx.user.email || `User ${userId}`,
          input.reason,
          ctx.user.hakiScore
        );

        // Log analytics
        await logAnalyticsEvent({
          userId,
          eventType: "contact_requested",
          eventData: JSON.stringify({ reason: input.reason }),
        });

        return { success: true };
      }),
  }),

  // === ADMIN PANEL ===
  admin: router({
    getPendingTapes: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const tapes = await getTapesByStatus("pending");
      return tapes.map(t => ({
        ...t,
        tracks: JSON.parse(t.tracks),
      }));
    }),

    reviewTape: protectedProcedure
      .input(z.object({
        tapeId: z.number(),
        status: z.enum(["approved", "rejected"]),
        reviewNote: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await updateTapeStatus(
          input.tapeId,
          input.status,
          ctx.user.id,
          input.reviewNote
        );

        // If approved, award bonus Haki to creator
        if (input.status === "approved") {
          const tapes = await getTapesByStatus("approved");
          const tape = tapes.find(t => t.id === input.tapeId);
          if (tape) {
            await awardHaki(
              tape.creatorId,
              "tape_approved",
              HakiPoints.TAPE_APPROVED,
              { tapeId: input.tapeId, title: tape.title }
            );
          }
        }

        return { success: true };
      }),

    getPendingContactRequests: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return await getPendingContactRequests();
    }),

    reviewContactRequest: protectedProcedure
      .input(z.object({
        requestId: z.number(),
        status: z.enum(["approved", "rejected"]),
        contactMethod: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await updateContactRequestStatus(
          input.requestId,
          input.status,
          ctx.user.id,
          input.contactMethod
        );

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
