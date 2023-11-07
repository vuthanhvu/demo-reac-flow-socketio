import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnModuleInit {
  private roomIdListTrans: string;
  @WebSocketServer()
  server: Server;

  constructor() {
    this.roomIdListTrans = `react-flow`;
    console.log(`==>`, this.roomIdListTrans);
  }

  onModuleInit(): void {
    this.server.on('connection', async (socket: Socket) => {
      try {
        socket.join(this.roomIdListTrans);
      } catch (e) {
        socket.disconnect();
      }
    });
  }

  async sendClient(data: any) {
    console.log(`==>SendClient`);

    this.server.in(this.roomIdListTrans).emit('response', data);
  }

  @SubscribeMessage('update')
  async handleUpdate(@MessageBody() data: any) {
    console.log(`==>`, data);
    this.sendClient(data);

    // this.server
    //   .in(roomId)
    //   .emit(EventNameEnum.ReadAlert, { notificationId: data.id });
    // this.server.in(roomId).emit(EventNameEnum.HasUnReadNotification, {
    //   unread: !!unreadNotifications,
    // });
  }
}
