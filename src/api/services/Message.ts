import { MessageProps, MessageResponseProps } from '@app/types/redux/message';
import { userAPI } from '@app/api';
import {
  CreateMessageDataProps,
  ReadAllMessagesDataProps,
  SharePhotoDataProps,
} from '@app/types/api';

async function messages(conversationId: string) {
  const {
    data: { results },
  } = await userAPI.get<{
    results: MessageProps;
  }>(`/message/${conversationId}`);

  return results?.messages;
}
async function createMessage(data: CreateMessageDataProps) {
  const {
    data: { results },
  } = await userAPI.post<{
    results: MessageResponseProps;
  }>(`/message/${data.conversationId}`, data.data);
  return results;
}
async function readAllMessages(data: ReadAllMessagesDataProps) {
  await userAPI.get(
    `/message/${data.conversationId}/${data.receiverId}/readAllMessages`,
  );
  return data.conversationId;
}
async function sharePhoto(data: SharePhotoDataProps) {
  const form = new FormData();
  form.append('image', data.image);
  form.append('imageType', data.imageType);
  form.append('uuid', data.uuid);

  const {
    data: { results },
  } = await userAPI.post<{
    results: MessageResponseProps;
  }>(`/message/${data.conversationId}/sendImage`, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return results;
}

export default {
  messages,
  createMessage,
  readAllMessages,
  sharePhoto,
};
