"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const mentor_js_1 = require("./tools/mentor.js");
const student_js_1 = require("./tools/student.js");
const shared_js_1 = require("./tools/shared.js");
const server = new index_js_1.Server({
    name: 'lyra-mentor-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
const tools = [
    mentor_js_1.postChallengeTool,
    mentor_js_1.postReviewTool,
    mentor_js_1.getSubmissionsTool,
    student_js_1.getPendingTaskTool,
    student_js_1.getMentorFeedbackTool,
    student_js_1.submitWorkTool,
    shared_js_1.getCurriculumTool,
];
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: tools.map(t => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema,
        })),
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const tool = tools.find(t => t.name === request.params.name);
    if (!tool) {
        throw new Error(`Tool not found: ${request.params.name}`);
    }
    try {
        return await tool.handler(request.params.arguments);
    }
    catch (error) {
        return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('Lyra Mentor MCP server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map