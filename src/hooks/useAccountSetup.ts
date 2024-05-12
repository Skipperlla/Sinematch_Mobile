import { useCallback } from 'react';
import { useRoute } from '@react-navigation/native';

import { AccountSetupPages } from '@app/constants/pages';
import { useAppNavigation } from '@app/hooks';

export default function () {
  const route = useRoute();
  const navigation = useAppNavigation();
  const currentPage =
    AccountSetupPages.findIndex((page) => page === route.name) + 1;

  const nextPage = useCallback(
    // TODO: Fix this any
    () => navigation.navigate(AccountSetupPages[currentPage] as any),

    [],
  );
  return { currentPage, nextPage };
}
