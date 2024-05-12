import React, {
  useState,
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
  useCallback,
} from 'react';
import Animated, {
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import { useDiscovery as useDiscoveryHook, useSwipe } from '@app/hooks';
import { CatchErrorProps, DiscoveriesProps } from '@app/types/redux/discovery';

type DiscoveryContextProps = {
  swipeBack: Animated.SharedValue<boolean>;
  userIndex: Animated.SharedValue<number>;
  memoizedCards: DiscoveriesProps[];
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
  currentUserId: Animated.SharedValue<string>;
  onSwipeRight: (userId: string) => void;
  onSwipeLeft: (userId: string) => void;
};

const DiscoveryContext = createContext<DiscoveryContextProps>(
  {} as DiscoveryContextProps,
);

export const DiscoveryProvider = ({ children }: PropsWithChildren) => {
  const { Discoveries, setLikes, rejectUserAction } = useDiscoveryHook();
  const { swipeRight } = useSwipe();
  const swipeBack = useSharedValue(false);
  const currentUserId = useSharedValue('');
  const userIndex = useSharedValue(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const memoizedCards = Discoveries?.slice(currentIndex, currentIndex + 2)
    ?.reverse()
    .sort((a, b) => a.plan - b.plan);

  useDerivedValue(() => {
    userIndex.value = memoizedCards?.length < 2 ? 0 : 1;
  }, [memoizedCards]);

  const onSwipeRight = useCallback(async (userId: string) => {
    currentUserId.value = userId;
    try {
      await swipeRight(userId, swipeBack);
      const resetCard = setTimeout(
        () => setCurrentIndex((prevIndex) => prevIndex + 1),
        100,
      );
      return () => clearTimeout(resetCard);
    } catch (err) {
      const error = err as CatchErrorProps;
      if (error.statusCode === 402) return;
      const resetCard = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setLikes(userId);
      }, 100);
      return () => clearTimeout(resetCard);
    }
  }, []);
  const onSwipeLeft = useCallback(async (userId: string) => {
    currentUserId.value = userId;
    try {
      await rejectUserAction(userId);
      const resetCard = setTimeout(
        () => setCurrentIndex((prevIndex) => prevIndex + 1),
        100,
      );
      return () => clearTimeout(resetCard);
    } catch {
      const resetCard = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setLikes(userId);
      }, 100);

      return () => clearTimeout(resetCard);
    }
  }, []);

  const DiscoveryContextValues = useMemo(
    () => ({
      swipeBack,
      memoizedCards,
      setCurrentIndex,
      currentIndex,
      currentUserId,
      onSwipeRight,
      onSwipeLeft,
      userIndex,
    }),
    [memoizedCards, currentIndex],
  );
  return (
    <DiscoveryContext.Provider value={DiscoveryContextValues}>
      {children}
    </DiscoveryContext.Provider>
  );
};

function useDiscovery() {
  const context = useContext(DiscoveryContext);
  return context;
}
export default {
  DiscoveryProvider,
  useDiscovery,
};
