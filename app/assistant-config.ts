import { OpenAI } from 'openai';

export let assistantId = process.env.OPENAI_ASSISTANT_ID || "";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})
