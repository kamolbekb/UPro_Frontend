import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { HubConnectionState } from '@shared/constants/signalrEvents';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { ENDPOINTS } from '@shared/api/endpoints';

interface SignalRContextValue {
  connection: HubConnection | null;
  connectionState: HubConnectionState;
}

const SignalRContext = createContext<SignalRContextValue>({
  connection: null,
  connectionState: HubConnectionState.DISCONNECTED,
});

/**
 * Hook to access SignalR connection
 */
export function useSignalR() {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within SignalRProvider');
  }
  return context;
}

interface SignalRProviderProps {
  children: React.ReactNode;
}

/**
 * SignalR provider for real-time chat functionality
 *
 * Features:
 * - Automatic connection on mount when authenticated
 * - Exponential backoff reconnection strategy (1s, 2s, 4s, 8s, max 30s)
 * - Clean disconnection on unmount
 * - Connection state tracking
 */
export function SignalRProvider({ children }: SignalRProviderProps) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    HubConnectionState.DISCONNECTED
  );
  const { isAuthenticated, getAccessToken } = useAuthStore();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Build SignalR connection to chat hub
    const hubUrl = `${import.meta.env.VITE_API_BASE_URL}${ENDPOINTS.chat.hub}`;
    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          const token = getAccessToken();
          return token || '';
        },
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
          const delay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          return delay;
        },
      })
      .configureLogging(import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning)
      .build();

    // Connection state handlers
    newConnection.onreconnecting(() => {
      setConnectionState(HubConnectionState.RECONNECTING);
    });

    newConnection.onreconnected(() => {
      setConnectionState(HubConnectionState.CONNECTED);
      reconnectAttempts.current = 0;
    });

    newConnection.onclose(() => {
      setConnectionState(HubConnectionState.DISCONNECTED);
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('SignalR: Max reconnection attempts reached');
      }
    });

    // Start connection
    const startConnection = async () => {
      try {
        setConnectionState(HubConnectionState.CONNECTING);
        await newConnection.start();
        setConnectionState(HubConnectionState.CONNECTED);
        reconnectAttempts.current = 0;
        console.log('SignalR: Connected');
      } catch (error) {
        console.error('SignalR: Connection failed', error);
        setConnectionState(HubConnectionState.DISCONNECTED);
      }
    };

    startConnection();
    setConnection(newConnection);

    // Cleanup on unmount
    return () => {
      if (newConnection.state !== 'Disconnected') {
        newConnection.stop();
      }
    };
  }, [isAuthenticated, getAccessToken]);

  return (
    <SignalRContext.Provider value={{ connection, connectionState }}>
      {children}
    </SignalRContext.Provider>
  );
}
