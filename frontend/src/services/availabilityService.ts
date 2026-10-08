import { fetchApi } from './api';

export const checkAvailability = async (date: string, startTime: string, duration?: string) => {
  let url = `/availability?date=${date}&startTime=${startTime}`;
  if (duration) url += `&duration=${encodeURIComponent(duration)}`;
  
  return fetchApi(url);
};
