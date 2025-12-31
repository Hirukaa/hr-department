// src/ai/flows/face-verification.ts
'use server';
/**
 * @fileOverview Implements face verification using Genkit to compare a live image with enrolled face data.
 *
 * - verifyFace - Compares a live image with stored face embeddings to verify identity.
 * - FaceVerificationInput - The input type for the verifyFace function.
 * - FaceVerificationOutput - The return type for the verifyFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaceVerificationInputSchema = z.object({
  livePhotoDataUri: z
    .string()
    .describe(
      'A photo of the person checking in, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep the single quotes, they are part of the spec
    ),
  enrolledFaceEmbedding: z.string().describe('The stored face embedding for the employee.'),
});

export type FaceVerificationInput = z.infer<typeof FaceVerificationInputSchema>;

const FaceVerificationOutputSchema = z.object({
  confidenceScore: z
    .number()
    .describe(
      'The confidence score of the face verification, ranging from 0 to 1, where 1 is a perfect match.'
    ),
  isMatch: z.boolean().describe('Whether the live photo matches the enrolled face.'),
});

export type FaceVerificationOutput = z.infer<typeof FaceVerificationOutputSchema>;

export async function verifyFace(input: FaceVerificationInput): Promise<FaceVerificationOutput> {
  return faceVerificationFlow(input);
}

const faceVerificationPrompt = ai.definePrompt({
  name: 'faceVerificationPrompt',
  input: {schema: FaceVerificationInputSchema},
  output: {schema: FaceVerificationOutputSchema},
  prompt: `You are an expert in face recognition and biometric authentication.

You will compare a live photo against an enrolled face embedding to determine if they match.

Return a confidence score indicating the likelihood of a match, and a boolean value indicating whether the faces match.

Live Photo: {{media url=livePhotoDataUri}}
Enrolled Face Embedding: {{{enrolledFaceEmbedding}}}

Consider factors such as image quality, lighting conditions, and potential obfuscation attempts.

Based on your analysis, determine the confidence score and whether it's a match:
`,
});

const faceVerificationFlow = ai.defineFlow(
  {
    name: 'faceVerificationFlow',
    inputSchema: FaceVerificationInputSchema,
    outputSchema: FaceVerificationOutputSchema,
  },
  async input => {
    const {output} = await faceVerificationPrompt(input);
    return output!;
  }
);

