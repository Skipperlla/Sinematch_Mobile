import { MediaProps } from './media';
import { ImageProps } from './user';

export type MessageStatusProps = 'pending' | 'delivered';

export type MessageResponseProps = {
  _id: string;
  sender: string;
  text?: string;
  media?: MediaProps;
  image?: ImageProps;
  conversationId: string;
  isRead: boolean;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  reply?: {
    conversation: string;
    sender: string;
    text: string;
    media: MediaProps;
    image: ImageProps;
    isRead: boolean;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
  };
  status: MessageStatusProps;
};
export type MessageState = {
  Message: MessageProps;
  isLoading: boolean;
  statusCode: number | null;
};
export type MessageProps = {
  messages: MessageResponseProps[];
  count: number;
};
export type ReadAllMessagesProps = {
  conversationId: string;
  receiverId: string;
};
export type CreateMessageProps = {
  conversationId: string;
  text: string;
};
