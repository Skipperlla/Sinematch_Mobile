import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { userAPI } from '@app/api';
import type {
  CreateConversationProps,
  ConversationProps,
  ConversationState,
} from '@app/types/redux/conversation';
import { MessageResponseProps } from '@app/types/redux/message';

const defaultState: ConversationState = {
  Conversation: {
    conversations: [],
    count: 0,
  } as ConversationProps,
  isLoading: false,
  statusCode: null,
};

export const createConversation = createAsyncThunk(
  '/Conversation/createConversation',
  async (
    {
      receiverId,
      discoveryId,
    }: {
      receiverId: string;
      discoveryId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await userAPI.post<{
        results: CreateConversationProps;
      }>(`/conversation/${receiverId}`, { discoveryId });
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
export const allConversations = createAsyncThunk(
  '/allConversations',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.get<{
        results: ConversationProps;
      }>('/conversation', {
        params: {
          limit,
        },
      });
      return data?.results;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);
type EndConversationProps = {
  receiverId: string;
  conversationId: string;
};
export const endConversation = createAsyncThunk(
  '/endConversation',
  async (
    { receiverId, conversationId }: EndConversationProps,
    { rejectWithValue },
  ) => {
    try {
      await userAPI.delete<string>(
        `/conversation/${receiverId}/${conversationId}`,
      );
      return conversationId;
    } catch (err) {
      const { response } = err as APIError;
      return rejectWithValue(response?.data?.error?.message);
    }
  },
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState: defaultState,
  reducers: {
    removeConversation: (state, action: PayloadAction<string>) => {
      state.Conversation.conversations =
        state.Conversation.conversations.filter((conversation) => {
          return conversation.uuid !== action.payload;
        });
      state.Conversation.count -= 1;
    },
    resetInitialState: (state) => {
      state.Conversation.conversations = [];
      state.Conversation.count = 0;
      state.isLoading = false;
      state.statusCode = null;
    },

    setNewLastMessage: (
      state,
      action: PayloadAction<
        MessageResponseProps & {
          conversationId: string;
        }
      >,
    ) => {
      state.Conversation.conversations = state.Conversation.conversations.map(
        (conversation) => {
          if (conversation.uuid === action.payload.conversationId) {
            return {
              ...conversation,
              lastMessage: action.payload,
            };
          }
          return conversation;
        },
      );
    },
    addConversation: (
      state,
      action: PayloadAction<CreateConversationProps>,
    ) => {
      state.Conversation.conversations =
        state.Conversation.conversations.filter((conversation) => {
          return conversation.uuid !== action.payload.uuid;
        });
      state.Conversation.conversations.unshift(action.payload);

      state.Conversation.count += 1;
    },
    readAllMessages: (state, action: PayloadAction<string>) => {
      state.Conversation.conversations = state.Conversation.conversations.map(
        (item) => {
          if (item.uuid === action.payload && item?.lastMessage) {
            return {
              ...item,
              lastMessage: {
                ...item.lastMessage,
                isRead: true,
              },
            };
          }
          return item;
        },
      );
    },
  },

  extraReducers: (builder) => {
    builder.addCase(createConversation.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      createConversation.fulfilled,
      (state, action: PayloadAction<CreateConversationProps>) => {
        state.isLoading = false;
        // TODO: Add the new conversation to the top of the list
        state.Conversation.conversations =
          state.Conversation.conversations.concat(action.payload);
        state.Conversation.count += 1;
      },
    );
    builder.addCase(createConversation.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(allConversations.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      allConversations.fulfilled,
      (state, action: PayloadAction<ConversationProps>) => {
        state.Conversation = action.payload;
        state.isLoading = false;
      },
    );
    builder.addCase(allConversations.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(endConversation.pending, (state) => {
      state.isLoading = true;
      state.statusCode = null;
    });
    builder.addCase(
      endConversation.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.Conversation.conversations =
          state.Conversation.conversations.filter(
            (conversation) => conversation.uuid !== action.payload,
          );
        state.Conversation.count -= 1;
        state.isLoading = false;
      },
    );
    builder.addCase(endConversation.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const {
  removeConversation,
  addConversation,
  setNewLastMessage,
  readAllMessages,
  resetInitialState,
} = conversationSlice.actions;
export default conversationSlice.reducer;
