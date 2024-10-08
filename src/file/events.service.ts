import { Injectable } from '@nestjs/common';
import { Response } from 'express';

type EventType = 'notification' | 'data' | 'progress';

@Injectable()
export class EventsService {
  clients: Map<string, any>;

  constructor() {
    this.clients = new Map();
  }

  addClient(id: string, res: Response) {
    this.clients.set(id, res);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    });
  }

  sendMessage(id: string, type: EventType, message: string) {
    const res = this.clients.get(id);
    if (res) {
      res.write(`event: ${type}\ndata: ${message} \n\n`);
    }
  }
  removeClient(id: string) {
    this.clients.delete(id);
    console.log(`Client ${id} disconnected`);
  }

  broadcastMessage(type: EventType, message: string) {
    this.clients.forEach((res, id) => {
      console.log(`Sending client message${id}`);
      res.write(`event: ${type}\ndata: ${message} \n\n`);
    });
  }
}
