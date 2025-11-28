import { describe, expect, it } from "vitest";

describe("Telegram Bot Configuration", () => {
  it("should validate Telegram Bot Token and Chat ID", async () => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    expect(botToken).toBeDefined();
    expect(chatId).toBeDefined();

    // Test Telegram API connection
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.result).toBeDefined();
    expect(data.result.is_bot).toBe(true);

    console.log("✅ Telegram Bot validated:", data.result.username);
  });

  it("should send a test notification", async () => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `🐰⚡ *NAKAMA OS - Test Notification*\n\n✅ Telegram integration is working!\n\nTimestamp: ${new Date().toISOString()}`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data.ok).toBe(true);

    console.log("✅ Test notification sent successfully");
  });
});
