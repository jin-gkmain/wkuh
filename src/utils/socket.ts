import io, { Socket } from 'socket.io-client';

// const ENDPOINT = process.env.NEXT_PUBLIC_SERVER_UR;
// const ENDPOINT = 'http://localhost:8080';
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT;

let socket: Socket | null = null;

const initSocket = () => {
  socket = io(ENDPOINT);

  socket.on('connect', () => {
    console.log('소켓 연결 성공');
  });

  socket.on('disconnect', () => {
    console.log('소켓 연결 해제');
  });
};

const getSocket = (): Socket => {
  if (!socket) {
    initSocket();
  } else {
    if (!socket.connected) {
      socket.connect();
    }
  }
  return socket!;
};

const emitEvent = <T>(event: string, data: T) => {
  const socketInstance = getSocket();
  socketInstance.emit(event, data);
};

const onEvent = <T>(event: string, cb: (data: T) => void) => {
  const socketInstance = getSocket();
  socketInstance.on(event, cb);
};

const disconnectSocket = () => {
  const socketInstance = getSocket();
  socketInstance.disconnect();
};

export { emitEvent, onEvent, disconnectSocket };
