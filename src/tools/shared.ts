import { store } from '../store.js';
import { z } from 'zod';

export const getCurriculumTool = {
  name: 'get_curriculum',
  description: 'Get the full learning curriculum and milestones.',
  inputSchema: z.object({}),
  handler: async () => {
    const curriculum = await store.getCurriculum();
    return { content: [{ type: 'text', text: JSON.stringify(curriculum, null, 2) }] };
  }
};
