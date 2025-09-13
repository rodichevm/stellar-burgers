import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { isLoading, data } = useSelector((state: RootState) => state.feed);
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);
  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <FeedUI
          orders={data.orders}
          handleGetFeeds={() => {
            dispatch(fetchFeed());
          }}
        />
      )}
    </>
  );
};
