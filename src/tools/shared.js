"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurriculumTool = void 0;
const store_1 = require("../store");
const zod_1 = require("zod");
exports.getCurriculumTool = {
    name: 'get_curriculum',
    description: 'Get the full learning curriculum and milestones.',
    inputSchema: zod_1.z.object({}),
    handler: async () => {
        const curriculum = await store_1.store.getCurriculum();
        return { content: [{ type: 'text', text: JSON.stringify(curriculum, null, 2) }] };
    }
};
//# sourceMappingURL=shared.js.map