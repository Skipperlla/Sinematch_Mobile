import { userAPI } from '@app/api';
import type { CompareProfileProps } from '@app/types/redux/user';

async function compareProfile(userId: string) {
  const { data } = await userAPI.get<{ results: CompareProfileProps }>(
    `/compare/${userId}`,
  );
  return data?.results ?? null;
}

export default {
  compareProfile,
};
