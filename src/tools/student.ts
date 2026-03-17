import { store } from '../store.js';
import type { Submission } from '../store.js';
import { z } from 'zod';

export const getPendingTaskTool = {
  name: 'get_pending_task',
  description: 'Read the current active challenge assigned by the mentor.',
  inputSchema: z.object({}),
  handler: async () => {
    const challenges = await store.getChallenges();
    const active = challenges.filter(c => c.status === 'active');
    return { content: [{ type: 'text', text: JSON.stringify(active, null, 2) }] };
  }
};

export const getMentorFeedbackTool = {
  name: 'get_mentor_feedback',
  description: 'Read the latest review feedback from the mentor.',
  inputSchema: z.object({}),
  handler: async () => {
    const reviews = await store.getReviews();
    // Sort by date and return latest
    const sorted = [...reviews].sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime());
    return { content: [{ type: 'text', text: JSON.stringify(sorted[0] || null, null, 2) }] };
  }
};

export const submitWorkTool = {
  name: 'submit_work',
  description: 'Submit your analysis and notes for a completed challenge.',
  inputSchema: z.object({
    challenge_id: z.string(),
    notes: z.string()
  }),
  handler: async (args: any) => {
    const submissions = await store.getSubmissions();
    const challenges = await store.getChallenges();
    const challenge = challenges.find(c => c.id === args.challenge_id);

    if (!challenge) {
      throw new Error(`Challenge not found: ${args.challenge_id}`);
    }

    const submission: Submission = {
      id: `sub_${Date.now()}`,
      challenge_id: args.challenge_id,
      lyra_notes: args.notes,
      submitted_at: new Date().toISOString(),
      status: 'pending_review'
    };

    submissions.push(submission);
    await store.saveSubmissions(submissions);

    return { content: [{ type: 'text', text: `Work submitted for challenge ${args.challenge_id}. ID: ${submission.id}` }] };
  }
};
