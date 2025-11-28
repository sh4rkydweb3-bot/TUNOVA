import { describe, it, expect } from 'vitest';

describe('OpenRouter API Key Validation', () => {
  it('should successfully authenticate with OpenRouter using the provided API key', async () => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe('');
    
    // Test API call with minimal token usage
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Nakama OS BeatBunny Test'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          { role: 'user', content: 'Hi' }
        ],
        max_tokens: 10
      })
    });
    
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data).toHaveProperty('choices');
    expect(data.choices).toBeInstanceOf(Array);
    expect(data.choices.length).toBeGreaterThan(0);
    expect(data.choices[0]).toHaveProperty('message');
    expect(data.choices[0].message).toHaveProperty('content');
  }, 15000); // 15 second timeout for API call
});
