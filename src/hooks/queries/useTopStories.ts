import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './keys';
import { api } from '@/utils/api';
import { API_PATHS } from '@/utils/api/paths';
import { StoryDto } from './types/story';
import { SortOption } from '@/utils/storage';
import { sortStories } from '@/utils/sorting';
import { useMemo } from 'react';

export const useTopStories = (sortBy: SortOption = 'score') => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [QUERY_KEYS.topStories],
    queryFn,
    staleTime: 0,
  });

  const sortedData = useMemo(() => {
    if (data) {
      return sortStories(data, sortBy);
    }
  }, [data, sortBy]);

  return {
    topStories: sortedData,
    isTopStoriesLoading: isLoading,
    isTopStoriesRefetching: isRefetching,
    topStoriesError: error,
    refetchTopStories: refetch,
  };
};

const queryFn = async () => {
  const ids = await getTopStoryIds();
  const items = await getItemsByIds(ids.slice(0, 20));
  return items.filter(item => item.type === 'story' && item.url);
};

export const getTopStoryIds = async (): Promise<number[]> => {
  const res = await api.get<number[]>(API_PATHS.topStories);
  return res.data || [];
};

export const getItemsByIds = async (ids: number[]): Promise<StoryDto[]> => {
  const results = await Promise.all(
    ids.map(async id => {
      const res = await api.get<StoryDto>(API_PATHS.item(id));
      return res.data;
    }),
  );

  return results.filter(
    (item): item is StoryDto => item !== undefined && item !== null,
  );
};
