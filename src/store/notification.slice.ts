import { userAPI } from '@app/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { NotificationType } from '@app/constants';

const initialState = {};

export const registerToken = createAsyncThunk(
  '/registerToken',
  async (fcmToken: string, { rejectWithValue }) => {
    try {
      await userAPI.post('/notification/registerToken', { fcmToken });

      return null;
    } catch (err) {
      return rejectWithValue(null);
    }
  },
);

type SendNotificationProps = {
  title: string;
  body: string;
  useTranslation?: boolean;
  notificationType: keyof typeof NotificationType;
  receiverId: string;
  data?: { [key: string]: string };
};
export const sendNotification = createAsyncThunk(
  '/sendNotification',
  async (
    {
      title,
      body,
      useTranslation,
      notificationType,
      receiverId,
      data,
    }: SendNotificationProps,
    { rejectWithValue },
  ) => {
    try {
      await userAPI.post(`/notification/sent/${receiverId}`, {
        notification: {
          title,
          body,
        },
        useTranslation,
        notificationType,
        data,
      });
      return null;
    } catch (err) {
      return rejectWithValue(null);
    }
  },
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
});

export default notificationSlice.reducer;
export const {} = notificationSlice.actions;
