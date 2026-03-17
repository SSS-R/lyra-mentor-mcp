"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubmissionsTool = exports.postReviewTool = exports.postChallengeTool = void 0;
const store_1 = require("../store");
const zod_1 = require("zod");
exports.postChallengeTool = {
    name: 'post_challenge',
    description: 'Post a new challenge for Lyra to complete.',
    inputSchema: zod_1.z.object({
        track: zod_1.z.enum(['senior-dev', 'qa', 'seo']),
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        hints: zod_1.z.array(zod_1.z.string()).optional()
    }),
    handler: async (args) => {
        const challenges = await store_1.store.getChallenges();
        const newChallenge = {
            id: `ch_${Date.now()}`,
            track: args.track,
            title: args.title,
            description: args.description,
            hints: args.hints || [],
            status: 'active',
            created_at: new Date().toISOString()
        };
        challenges.push(newChallenge);
        await store_1.store.saveChallenges(challenges);
        return { content: [{ type: 'text', text: `Challenge posted: ${newChallenge.id}` }] };
    }
};
exports.postReviewTool = {
    name: 'post_review',
    description: 'Provide feedback on Lyra\'s submitted work.',
    inputSchema: zod_1.z.object({
        submission_id: zod_1.z.string(),
        feedback: zod_1.z.string(),
        grade: zod_1.z.enum(['pass', 'needs-work', 'fail']),
        next_challenge_id: zod_1.z.string().optional()
    }),
    handler: async (args) => {
        const reviews = await store_1.store.getReviews();
        const submissions = await store_1.store.getSubmissions();
        const submission = submissions.find(s => s.id === args.submission_id);
        if (!submission) {
            throw new Error(`Submission not found: ${args.submission_id}`);
        }
        const newReview = {
            id: `rev_${Date.now()}`,
            submission_id: args.submission_id,
            feedback: args.feedback,
            grade: args.grade,
            next_challenge_id: args.next_challenge_id,
            reviewed_at: new Date().toISOString()
        };
        reviews.push(newReview);
        await store_1.store.saveReviews(reviews);
        // Update submission status
        submission.status = 'reviewed';
        await store_1.store.saveSubmissions(submissions);
        return { content: [{ type: 'text', text: `Review posted for submission ${args.submission_id}` }] };
    }
};
exports.getSubmissionsTool = {
    name: 'get_submissions',
    description: 'List Lyra\'s work submissions.',
    inputSchema: zod_1.z.object({
        status: zod_1.z.enum(['pending_review', 'reviewed']).optional()
    }),
    handler: async (args) => {
        const submissions = await store_1.store.getSubmissions();
        const filtered = args.status ? submissions.filter(s => s.status === args.status) : submissions;
        return { content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }] };
    }
};
//# sourceMappingURL=mentor.js.map