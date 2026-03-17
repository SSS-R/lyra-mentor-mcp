import { z } from 'zod';
export declare const getPendingTaskTool: {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{}, z.core.$strip>;
    handler: () => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
};
export declare const getMentorFeedbackTool: {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{}, z.core.$strip>;
    handler: () => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
};
export declare const submitWorkTool: {
    name: string;
    description: string;
    inputSchema: z.ZodObject<{
        challenge_id: z.ZodString;
        notes: z.ZodString;
    }, z.core.$strip>;
    handler: (args: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
};
//# sourceMappingURL=student.d.ts.map