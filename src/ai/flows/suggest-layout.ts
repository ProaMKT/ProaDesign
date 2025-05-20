// The AI layout suggestion flow.
//
// - suggestLayout - A function that suggests an optimal layout for a PDF based on content and branding elements.
// - SuggestLayoutInput - The input type for the suggestLayout function.
// - SuggestLayoutOutput - The return type for the suggestLayout function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLayoutInputSchema = z.object({
  contentLength: z
    .string()
    .describe('The length of the content to be included in the PDF (short, medium, long).'),
  brandingElements: z.string().describe('Description of the branding elements to be used.'),
});
export type SuggestLayoutInput = z.infer<typeof SuggestLayoutInputSchema>;

const SuggestLayoutOutputSchema = z.object({
  layoutSuggestion: z
    .string()
    .describe('A suggestion for the optimal layout of the PDF, considering content length and branding.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the layout suggestion, explaining how it improves readability and visual appeal.'),
});
export type SuggestLayoutOutput = z.infer<typeof SuggestLayoutOutputSchema>;

export async function suggestLayout(input: SuggestLayoutInput): Promise<SuggestLayoutOutput> {
  return suggestLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLayoutPrompt',
  input: {schema: SuggestLayoutInputSchema},
  output: {schema: SuggestLayoutOutputSchema},
  prompt: `You are an expert in document layout and design. Based on the content length and branding elements provided, suggest an optimal layout for a DIN A4 PDF to improve readability and visual appeal.

Content Length: {{{contentLength}}}
Branding Elements: {{{brandingElements}}}

Consider factors such as font sizes, margins, image placement, and color usage to create a visually appealing and easy-to-read document. Explain the reasoning behind your suggestion.
`,
});

const suggestLayoutFlow = ai.defineFlow(
  {
    name: 'suggestLayoutFlow',
    inputSchema: SuggestLayoutInputSchema,
    outputSchema: SuggestLayoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
