"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitWorkTool = exports.getMentorFeedbackTool = exports.getPendingTaskTool = void 0;
const store_1 = require("../store");
const zod_1 = require("zod");
exports.getPendingTaskTool = {
    name: 'get_pending_task',
    description: 'Read the current active challenge assigned by the mentor.',
    inputSchema: zod_1.z.object({}),
    handler: async () => {
        const challenges = await store_1.store.getChallenges();
        const active = challenges.filter(c => c.status === 'active');
        return { content: [{ type: 'text', text: JSON.stringify(active, null, 2) }] };
    }
};
exports.getMentorFeedbackTool = {
    name: 'get_mentor_feedback',
    description: 'Read the latest review feedback from the mentor.',
    inputSchema: zod_1.z.object({}),
    handler: async () => {
        const reviews = await store_1.store.getReviews();
        // Sort by date and return latest
        const sorted = [...reviews].sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime());
        return { content: [{ type: 'text', text: JSON.stringify(sorted[0] || null, null, 2) }] };
    }
};
exports.submitWorkTool = {
    name: 'submit_work',
    description: 'Submit your analysis and notes for a completed challenge.',
    inputSchema: zod_1.z.object({
        challenge_id: zod_1.z.string(),
        notes: zod_1.z.string()
    }),
    handler: async (args) => {
        const submissions = await store_1.store.getSubmissions();
        const challenges = await store_1.store.getChallenges();
        const challenge = challenges.find(c => c.id === args.challenge_id);
        if (!challenge) {
            throw new Error(`Challenge not found: ${args.challenge_id}`);
        }
        const submission = {
            id: `sub_${Date.now()}`,
            challenge_id: args.challenge_id,
            lyra_notes: args.notes,
            submitted_at: new Date().toISOString(),
            status: 'pending_review'
        };
        submissions.push(submission);
        await store_1.store.saveSubmissions(submissions);
        return { content: [{ type: 'text', text: `Work submitted for challenge ${args.challenge_id}. ID: ${submission.id}` }] };
    }
};
//# sourceMappingURL=student.js.map