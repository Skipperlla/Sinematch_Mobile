import { baseURL } from '@app/constants';
import { useUser } from '@app/hooks';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Socket, io } from 'socket.io-client';

type SocketContextProps = {
  socket?: Socket;
};

export const SocketContext = createContext<SocketContextProps>(
  {} as SocketContextProps,
);

const SocketProvider = ({ children }: PropsWithChildren) => {
  const { User, isLoggedIn } = useUser();
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {
    if (!isLoggedIn) return;
    const newSocket = io(baseURL, {
      transports: ['websocket'],
      auth: { uuid: User?.uuid },
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
    });

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, [isLoggedIn]);

  const SocketContextValues = useMemo(() => ({ socket }), [socket, isLoggedIn]);

  return (
    <SocketContext.Provider value={SocketContextValues}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export default {
  SocketProvider,
  useSocketContext,
};
