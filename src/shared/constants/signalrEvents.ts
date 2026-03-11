/**
 * SignalR event name constants for real-time chat
 *
 * Server → Client events (receive)
 */
export const SIGNALR_RECEIVE_EVENTS = {
  RECEIVE_MESSAGE: 'ReceiveMessage',
  MESSAGE_READ: 'MessageRead',
  USER_TYPING: 'UserTyping',
  USER_STOPPED_TYPING: 'UserStoppedTyping',
  CONVERSATION_UPDATED: 'ConversationUpdated',
} as const;

/**
 * Client → Server methods (invoke)
 */
export const SIGNALR_SEND_METHODS = {
  SEND_MESSAGE: 'SendMessage',
  MARK_AS_READ: 'MarkAsRead',
  START_TYPING: 'StartTyping',
  STOP_TYPING: 'StopTyping',
  JOIN_CONVERSATION: 'JoinConversation',
  LEAVE_CONVERSATION: 'LeaveConversation',
} as const;

/**
 * SignalR hub connection states
 */
export enum HubConnectionState {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting',
  RECONNECTING = 'Reconnecting',
}
