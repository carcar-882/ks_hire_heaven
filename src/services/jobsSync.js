export const JOBS_SYNC_EVENT = 'ks_jobs_sync_event';
export const JOBS_CHANNEL_NAME = 'ks_jobs_sync_channel';

export const notifyJobsUpdated = (detail = { action: 'refresh' }) => {
  if (typeof window === 'undefined') return;

  // 1. BroadcastChannel for cross-tab communication
  try {
    const channel = new BroadcastChannel(JOBS_CHANNEL_NAME);
    channel.postMessage({ timestamp: Date.now(), ...detail });
    channel.close();
  } catch (e) {}

  // 2. CustomEvent for within-page communication
  try {
    window.dispatchEvent(new CustomEvent(JOBS_SYNC_EVENT, { detail }));
  } catch (e) {}

  // 3. LocalStorage event for older browsers or if BroadcastChannel is unsupported
  try {
    localStorage.setItem(JOBS_SYNC_EVENT, JSON.stringify({ timestamp: Date.now(), ...detail }));
  } catch (e) {}
};

export const subscribeToJobsUpdates = (onUpdate) => {
  if (typeof window === 'undefined') return () => {};

  let channel = null;
  try {
    channel = new BroadcastChannel(JOBS_CHANNEL_NAME);
    channel.onmessage = () => {
      onUpdate();
    };
  } catch (e) {}

  const handleCustomEvent = () => onUpdate();
  const handleStorageEvent = (e) => {
    if (e.key === JOBS_SYNC_EVENT) onUpdate();
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') onUpdate();
  };

  window.addEventListener(JOBS_SYNC_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);
  window.addEventListener('focus', onUpdate);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    if (channel) {
      try { channel.close(); } catch (e) {}
    }
    window.removeEventListener(JOBS_SYNC_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    window.removeEventListener('focus', onUpdate);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};
