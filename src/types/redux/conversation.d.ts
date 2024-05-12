import { MessageResponseProps } from './message';
import { ImageProps } from './user';

export type ConversationProps = {
  conversations: CreateConversationProps[];
  count: number;
};

export type CreateConversationProps = {
  _id: string;
  conversationId: string;
  members: [
    {
      _id: string;
      fullName: string;
      avatars: ImageProps[];
      uuid: string;
    },
  ];
  isSuperLike: boolean;
  updatedAt: Date;
  createdAt: Date;
  uuid: string;
  lastMessage: MessageResponseProps;
  discoveryId: string;
};
export type ConversationState = {
  Conversation: ConversationProps;
  isLoading: boolean;
  statusCode: number | null;
};
