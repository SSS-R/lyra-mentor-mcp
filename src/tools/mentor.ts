import { store } from '../store.js';
import type { Challenge, Submission, Review } from '../store.js';
import { z } from 'zod';

export const postChallengeTool = {
  name: 'post_challenge',
  description: 'Post a new challenge for Lyra to complete.',
  inputSchema: z.object({
    track: z.enum(['senior-dev', 'qa', 'seo']),
    title: z.string(),
    description: z.string(),
    hints: z.array(z.string()).optional()
  }),
  handler: async (args: any) => {
    const challenges = await store.getChallenges();
    const newChallenge: Challenge = {
      id: `ch_${Date.now()}`,
      track: args.track,
      title: args.title,
      description: args.description,
      hints: args.hints || [],
      status: 'active',
      created_at: new Date().toISOString()
    };
    challenges.push(newChallenge);
    await store.saveChallenges(challenges);
    return { content: [{ type: 'text', text: `Challenge posted: ${newChallenge.id}` }] };
  }
};

export const postReviewTool = {
  name: 'post_review',
  description: 'Provide feedback on Lyra\'s submitted work.',
  inputSchema: z.object({
    submission_id: z.string(),
    feedback: z.string(),
    grade: z.enum(['pass', 'needs-work', 'fail']),
    next_challenge_id: z.string().optional()
  }),
  handler: async (args: any) => {
    const reviews = await store.getReviews();
    const submissions = await store.getSubmissions();
    const submission = submissions.find(s => s.id === args.submission_id);

    if (!submission) {
      throw new Error(`Submission not found: ${args.submission_id}`);
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      submission_id: args.submission_id,
      feedback: args.feedback,
      grade: args.grade,
      next_challenge_id: args.next_challenge_id,
      reviewed_at: new Date().toISOString()
    };

    reviews.push(newReview);
    await store.saveReviews(reviews);

    // Update submission status
    submission.status = 'reviewed';
    await store.saveSubmissions(submissions);

    return { content: [{ type: 'text', text: `Review posted for submission ${args.submission_id}` }] };
  }
};

export const getSubmissionsTool = {
  name: 'get_submissions',
  description: 'List Lyra\'s work submissions.',
  inputSchema: z.object({
    status: z.enum(['pending_review', 'reviewed']).optional()
  }),
  handler: async (args: any) => {
    const submissions = await store.getSubmissions();
    const filtered = args.status ? submissions.filter(s => s.status === args.status) : submissions;
    return { content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }] };
  }
};
