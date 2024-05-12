//? Messages

export type CreateMessageDataProps = {
  conversationId: string;
  data: LocalMessageProps;
};
export type LocalMessageProps = {
  text: string;
  uuid: string | number[];
  sender?: string;
};

export type ReadAllMessagesDataProps = {
  conversationId: string;
  receiverId: string;
};
export type SharePhotoDataProps = {
  conversationId: string;
  image: { uri: string; name: string; type: string };
  imageType: string;
  uuid: string | number[];
  data: LocalSharePhotoProps;
};
export type LocalSharePhotoProps = {
  uuid: string | number[];
  sender?: string;
  image: {
    Location: string;
    imageType: string;
    key: string | number[];
  };
  createdAt: Date;
};
