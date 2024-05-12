import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';

type PurchaseState = {
  packages: PurchasesPackage[] | undefined;
  purchaserInfo: CustomerInfo | null;
  isLoading: boolean;
  isPurchaseLoading: boolean;
};
const initialState: PurchaseState = {
  packages: [],
  purchaserInfo: null,
  isLoading: false,
  isPurchaseLoading: false,
};
export enum OfferingsIdentifier {
  Monthly = 'sin_40_m',
  Monthly_3 = 'sin_105_3m',
  Monthly_6 = 'sin_190_6m',
}

export const fetchOfferings = createAsyncThunk(
  'user/fetchOfferings',
  async () => {
    const offerings = await Purchases.getOfferings();
    if (
      offerings.current !== null &&
      offerings.current.availablePackages.length !== 0
    ) {
      return offerings.current.availablePackages;
    }
  },
);

export const fetchPurchaserInfo = createAsyncThunk(
  'user/fetchPurchaserInfo',
  async () => {
    return await Purchases.getCustomerInfo();
  },
);
export const purchasePackage = createAsyncThunk(
  'user/purchasePackage',
  async (pack: PurchasesPackage, { rejectWithValue }) => {
    try {
      const purchaseInfo = await Purchases.purchasePackage(pack);
      return purchaseInfo.customerInfo;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

//TODO: egerki kullanicinin aboneligi var ise customer info getirilmeli ve set edilmeli
export const restorePurchases = createAsyncThunk(
  'user/restorePurchases',
  async () => {
    const data = await Purchases.restorePurchases();

    return data?.activeSubscriptions?.length !== 0;
  },
);

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    setPurchaserInfo(state, action: PayloadAction<CustomerInfo>) {
      state.purchaserInfo = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchOfferings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchOfferings.fulfilled,
      (state, action: PayloadAction<PurchasesPackage[] | undefined>) => {
        state.packages = action.payload;
        state.isLoading = false;
      },
    );
    builder.addCase(fetchOfferings.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(fetchPurchaserInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPurchaserInfo.fulfilled, (state, action) => {
      state.purchaserInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchPurchaserInfo.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(purchasePackage.pending, (state) => {
      state.isPurchaseLoading = true;
    });
    builder.addCase(
      purchasePackage.fulfilled,
      (state, action: PayloadAction<CustomerInfo>) => {
        state.purchaserInfo = action.payload;
        state.isPurchaseLoading = false;
      },
    );
    builder.addCase(purchasePackage.rejected, (state) => {
      state.isPurchaseLoading = false;
    });

    builder.addCase(restorePurchases.pending, (state) => {
      state.isPurchaseLoading = true;
    });
    builder.addCase(restorePurchases.fulfilled, (state) => {
      state.isPurchaseLoading = false;
    });
    builder.addCase(restorePurchases.rejected, (state) => {
      state.isPurchaseLoading = false;
    });
  },
});

export const { setPurchaserInfo } = purchaseSlice.actions;
export default purchaseSlice.reducer;
