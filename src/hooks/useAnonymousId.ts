
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

export const useAnonymousId = () => {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize or retrieve anonymous ID
    let storedId = localStorage.getItem('anonymous_user_id');
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem('anonymous_user_id', storedId);
    }
    setAnonymousId(storedId);
  }, []);

  return anonymousId;
};

export const getAnonymousId = (): string => {
  let anonId = localStorage.getItem('anonymous_user_id');
  if (!anonId) {
    anonId = uuidv4();
    localStorage.setItem('anonymous_user_id', anonId);
  }
  return anonId;
};

export const getAnonymousQuota = (): number => {
  const quota = localStorage.getItem('anonymous_generations_remaining');
  if (quota === null) {
    localStorage.setItem('anonymous_generations_remaining', '1');
    return 1;
  }
  return parseInt(quota, 10);
};

export const decrementAnonymousQuota = (): void => {
  const currentQuota = getAnonymousQuota();
  if (currentQuota > 0) {
    localStorage.setItem('anonymous_generations_remaining', (currentQuota - 1).toString());
  }
};

export const clearAnonymousData = (): void => {
  localStorage.removeItem('anonymous_user_id');
  localStorage.removeItem('anonymous_generations_remaining');
};
