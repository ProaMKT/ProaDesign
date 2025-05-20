'use server';

import { suggestLayout, type SuggestLayoutInput, type SuggestLayoutOutput } from '@/ai/flows/suggest-layout';

export async function getAILayoutSuggestion(input: SuggestLayoutInput): Promise<SuggestLayoutOutput> {
  try {
    const result = await suggestLayout(input);
    return result;
  } catch (error) {
    console.error("Error getting AI layout suggestion:", error);
    // It's good practice to throw a more specific error or return an error object
    // For now, re-throwing the original error or a generic one.
    throw new Error("Failed to get AI layout suggestion.");
  }
}
