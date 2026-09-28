export interface AuthCredentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface Message {
  id: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  timestamp: number;
  chatId: string;
  senderName?: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface IncomingMessageNotification {
  receiptId: number;
  body: {
    typeWebhook: string;
    instanceData: {
      idInstance: number;
      wid: string;
      typeInstance: string;
    };
    timestamp: number;
    idMessage: string;
    senderData: {
      chatId: string;
      chatName: string;
      sender: string;
      senderName: string;
    };
    messageData: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
      extendedTextMessageData?: {
        text: string;
      };
    };
  };
}