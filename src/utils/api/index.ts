import { ENV } from '@/consts/config';
import { create } from 'apisauce';

export const api = create({
  baseURL: ENV.API_BASE_URL,
});
