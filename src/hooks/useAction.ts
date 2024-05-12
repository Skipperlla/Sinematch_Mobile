import { unwrapResult, AsyncThunk } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useNotify } from 'rn-notify';

import { useAppDispatch } from '@app/hooks';

//? We can use this hook instead of capturing the data with try-catch every time.
export default <Arg, Returned>(
  actionCreator: AsyncThunk<Returned, Arg, {}>,
) => {
  const dispatch = useAppDispatch();
  const notify = useNotify();

  return useCallback(async (arg: Arg) => {
    try {
      const result = await dispatch(actionCreator(arg));
      return unwrapResult(result);
    } catch (err) {
      if ((typeof err as string) === 'string')
        notify.error({
          message: err as string,
          duration: 5000,
        });

      return await Promise.reject(err);
    }
  }, []);
};
