import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { postChallengeTool, postReviewTool, getSubmissionsTool } from './tools/mentor.js';
import { getPendingTaskTool, getMentorFeedbackTool, submitWorkTool } from './tools/student.js';
import { getCurriculumTool } from './tools/shared.js';

dotenv.config();

const app = express();
const PORT = process.env.MCP_PORT || 3847;
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN || 'lyra-mentor-secret-xyz';

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Middleware
const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  if (token !== AUTH_TOKEN) {
    res.status(403).json({ error: 'Forbidden: Invalid token' });
    return;
  }
  
  next();
};

app.use(requireAuth);

// Helper to handle tool execution
const executeTool = async (tool: any, args: any, res: Response) => {
  try {
    const result = await tool.handler(args);
    // Parse JSON if it's text representation of JSON
    let parsedContent = result.content[0].text;
    try {
      if (parsedContent.startsWith('{') || parsedContent.startsWith('[')) {
        parsedContent = JSON.parse(parsedContent);
      }
    } catch(e) {}
    
    res.json({ success: true, data: parsedContent });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// --- REST Endpoints mapping to Tools ---

// Mentor Endpoints
app.post('/api/challenge', async (req: Request, res: Response) => {
  await executeTool(postChallengeTool, req.body, res);
});

app.post('/api/review', async (req: Request, res: Response) => {
  await executeTool(postReviewTool, req.body, res);
});

app.get('/api/submissions', async (req: Request, res: Response) => {
  await executeTool(getSubmissionsTool, req.query, res);
});

// Student Endpoints
app.get('/api/pending', async (req: Request, res: Response) => {
  await executeTool(getPendingTaskTool, {}, res);
});

app.get('/api/feedback', async (req: Request, res: Response) => {
  await executeTool(getMentorFeedbackTool, {}, res);
});

app.post('/api/submit', async (req: Request, res: Response) => {
  await executeTool(submitWorkTool, req.body, res);
});

// Shared Endpoints
app.get('/api/curriculum', async (req: Request, res: Response) => {
  await executeTool(getCurriculumTool, {}, res);
});

// Health check
app.get('/ping', (req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'lyra-mentor-http' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Lyra Mentor HTTP Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔒 Authentication required (Bearer token)`);
});
