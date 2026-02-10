import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { AgentRunner } from '../agents/AgentRunner';

export class Dashboard {
  private app: express.Application;
  private server: Server;
  private wss: WebSocketServer;
  private agentRunner: AgentRunner;
  private port: number;

  constructor(agentRunner: AgentRunner, port: number = 3000) {
    this.agentRunner = agentRunner;
    this.port = port;
    this.app = express();
    this.server = new Server(this.app);
    this.wss = new WebSocketServer({ server: this.server });

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../../public')));
  }

  private setupRoutes(): void {
    this.app.get('/api/agents', (req: Request, res: Response) => {
      const agents = this.agentRunner.getAgentStates();
      res.json({ agents });
    });

    this.app.get('/api/messages', (req: Request, res: Response) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const messages = this.agentRunner.getCollaboration().getMessageHistory(limit);
      res.json({ messages });
    });

    this.app.get('/api/messages/:agentId', (req: Request, res: Response) => {
      const agentId = req.params.agentId as string;
      const messages = this.agentRunner.getCollaboration().getMessagesForAgent(agentId);
      res.json({ messages });
    });

    this.app.get('/api/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date() });
    });
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[Dashboard] WebSocket client connected');

      ws.send(JSON.stringify({ type: 'connected', message: 'Connected to dashboard' }));

      this.agentRunner.getCollaboration().on('message', (message) => {
        ws.send(JSON.stringify({ type: 'message', data: message }));
      });

      this.agentRunner.getCollaboration().on('broadcast', (broadcast) => {
        ws.send(JSON.stringify({ type: 'broadcast', data: broadcast }));
      });

      ws.on('close', () => {
        console.log('[Dashboard] WebSocket client disconnected');
      });
    });
  }

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`[Dashboard] Server running on http://localhost:${this.port}`);
      console.log(`[Dashboard] WebSocket server running on ws://localhost:${this.port}`);
    });
  }

  public stop(): void {
    this.wss.close();
    this.server.close();
  }
}
