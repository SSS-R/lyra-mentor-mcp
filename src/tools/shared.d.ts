import { z } from 'zod';
export declare const getCurriculumTool: {
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
//# sourceMappingURL=shared.d.ts.map