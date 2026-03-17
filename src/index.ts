import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { postChallengeTool, postReviewTool, getSubmissionsTool } from './tools/mentor.js';
import { getPendingTaskTool, getMentorFeedbackTool, submitWorkTool } from './tools/student.js';
import { getCurriculumTool } from './tools/shared.js';

const server = new Server(
  {
    name: 'lyra-mentor-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const tools = [
  postChallengeTool,
  postReviewTool,
  getSubmissionsTool,
  getPendingTaskTool,
  getMentorFeedbackTool,
  submitWorkTool,
  getCurriculumTool,
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find(t => t.name === request.params.name);
  if (!tool) {
    throw new Error(`Tool not found: ${request.params.name}`);
  }

  try {
    return await tool.handler(request.params.arguments);
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lyra Mentor MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
