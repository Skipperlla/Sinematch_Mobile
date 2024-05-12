import {
  createConversation,
  allConversations,
  removeConversation as removeConversationReducer,
  addConversation as addConversationReducer,
  setNewLastMessage as setNewLastMessageReducer,
  readAllMessages as readAllMessagesReducer,
  resetInitialState as resetInitialStateReducer,
  endConversation,
} from '@app/store/conversation.slice';
import { useAction, useAppDispatch, useAppSelector } from '@app/hooks';
import { CreateConversationProps } from '@app/types/redux/conversation';
import { MessageResponseProps } from '@app/types/redux/message';

export default function useConversation() {
  const dispatch = useAppDispatch();
  const createConversationAction = useAction(createConversation);
  const allConversationsAction = useAction(allConversations);
  const endConversationAction = useAction(endConversation);

  const removeConversation = (payload: string) =>
    dispatch(removeConversationReducer(payload));
  const addConversation = (payload: CreateConversationProps) =>
    dispatch(addConversationReducer(payload));
  const setNewLastMessage = (
    payload: MessageResponseProps & {
      conversationId: string;
    },
  ) => dispatch(setNewLastMessageReducer(payload));
  const readAllMessages = (payload: string) =>
    dispatch(readAllMessagesReducer(payload));
  const resetInitialState = () => dispatch(resetInitialStateReducer());

  const conversation = useAppSelector((state) => state.conversation);

  return {
    ...conversation,
    createConversationAction,
    allConversationsAction,
    removeConversation,
    endConversationAction,
    addConversation,
    setNewLastMessage,
    readAllMessages,
    resetInitialState,
  };
}
