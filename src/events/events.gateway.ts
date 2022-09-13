import { Injectable } from "@nestjs/common";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

@Injectable()
@WebSocketGateway({
  namespace: "Test",
})
export class EventGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  afterInit(server: any) {
    // 소캣이 초기화 된 후 실행
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    // 소켓이 연결된 후 실행
  }

  handleConnection(@ConnectedSocket() client: any) {
    // 소켓이 끊어진 후 실행
  }
}
