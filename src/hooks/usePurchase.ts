import { CustomerInfo } from 'react-native-purchases';

import {
  fetchOfferings,
  fetchPurchaserInfo,
  setPurchaserInfo as setPurchaserInfoReducer,
  purchasePackage,
  restorePurchases,
} from '@app/store/purchases.slice';
import { useAction, useAppDispatch, useAppSelector } from '@app/hooks';

export default function usePurchase() {
  const dispatch = useAppDispatch();

  const fetchOfferingsAction = useAction(fetchOfferings);
  const fetchPurchaseInfoAction = useAction(fetchPurchaserInfo);
  const purchasePackageAction = useAction(purchasePackage);
  const restorePurchasesAction = useAction(restorePurchases);

  const setPurchaserInfo = (payload: CustomerInfo) =>
    dispatch(setPurchaserInfoReducer(payload));

  const purchase = useAppSelector((state) => state.purchase);

  return {
    ...purchase,
    fetchOfferingsAction,
    fetchPurchaseInfoAction,
    setPurchaserInfo,
    purchasePackageAction,
    restorePurchasesAction,
  };
}
