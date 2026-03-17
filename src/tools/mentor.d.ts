import { z } from 'zod';
export declare const postChallengeTool: {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        track: z.ZodEnum<{
            "senior-dev": "senior-dev";
            qa: "qa";
            seo: "seo";
        }>;
        title: z.ZodString;
        description: z.ZodString;
        hints: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    handler: (args: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
};
export declare const postReviewTool: {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        submission_id: z.ZodString;
        feedback: z.ZodString;
        grade: z.ZodEnum<{
            pass: "pass";
            "needs-work": "needs-work";
            fail: "fail";
        }>;
        next_challenge_id: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    handler: (args: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
};
export declare const getSubmissionsTool: {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<{
            pending_review: "pending_review";
            reviewed: "reviewed";
        }>>;
    }, z.core.$strip>;
    handler: (args: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
};
//# sourceMappingURL=mentor.d.ts.map