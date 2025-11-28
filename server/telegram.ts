/**
 * Telegram Notification Helper
 * Sends automated notifications to the Captain via Telegram Bot
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface TelegramNotification {
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Send a notification to Telegram
 */
export async function sendTelegramNotification(
  notification: TelegramNotification
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[Telegram] Bot token or chat ID not configured");
    return false;
  }

  try {
    const formattedMessage = formatMessage(notification);

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: formattedMessage,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      console.error("[Telegram] Failed to send notification:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Telegram] Error sending notification:", error);
    return false;
  }
}

/**
 * Format notification message for Telegram
 */
function formatMessage(notification: TelegramNotification): string {
  let message = `🐰⚡ *${notification.title}*\n\n${notification.message}`;

  if (notification.data) {
    message += "\n\n*Details:*\n";
    for (const [key, value] of Object.entries(notification.data)) {
      message += `• ${key}: ${value}\n`;
    }
  }

  message += `\n_${new Date().toLocaleString()}_`;

  return message;
}

/**
 * Predefined notification templates
 */
export const TelegramTemplates = {
  newUser: (wallet: string, hakiScore: number) =>
    sendTelegramNotification({
      title: "🆕 New User Connected",
      message: `A new NAKAMA has joined the crew!`,
      data: {
        Wallet: wallet,
        "Initial Haki": hakiScore,
      },
    }),

  waitlistJoin: (wallet: string, roles: string[], discord?: string, twitter?: string) =>
    sendTelegramNotification({
      title: "📋 New Waitlist Registration",
      message: `A user has joined the waitlist!`,
      data: {
        Wallet: wallet,
        Roles: roles.join(", "),
        Discord: discord || "N/A",
        Twitter: twitter || "N/A",
      },
    }),

  tapeSubmitted: (
    creator: string,
    type: "vhs" | "cassette",
    title: string,
    trackCount: number
  ) =>
    sendTelegramNotification({
      title: `🎬 New ${type.toUpperCase()} Submitted`,
      message: `A ${type === "vhs" ? "video" : "music"} tape is awaiting review!`,
      data: {
        Creator: creator,
        Title: title,
        Tracks: trackCount,
        Type: type.toUpperCase(),
      },
    }),

  hakiMilestone: (wallet: string, hakiScore: number, rank: string) =>
    sendTelegramNotification({
      title: "⚡ Haki Milestone Reached",
      message: `A NAKAMA has achieved a new rank!`,
      data: {
        Wallet: wallet,
        "Haki Score": hakiScore,
        Rank: rank,
      },
    }),

  contactRequest: (wallet: string, reason: string, hakiScore: number) =>
    sendTelegramNotification({
      title: "👨‍✈️ Captain Contact Request",
      message: `A user is requesting direct contact with the Captain!`,
      data: {
        Wallet: wallet,
        "Haki Score": hakiScore,
        Reason: reason,
      },
    }),
};
