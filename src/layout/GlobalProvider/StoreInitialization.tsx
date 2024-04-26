'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useEffect } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { LOBE_URL_IMPORT_NAME } from '@/const/url';
import { useImportConfig } from '@/hooks/useImportConfig';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useEnabledDataSync } from '@/hooks/useSyncData';
import { useGlobalStore } from '@/store/global';

const StoreInitialization = memo(() => {
  const [useFetchServerConfig, useFetchUserConfig, useInitPreference] = useGlobalStore((s) => [
    s.useFetchServerConfig,
    s.useFetchUserConfig,
    s.useInitPreference,
  ]);
  // init the system preference
  useInitPreference();

  const { isLoading } = useFetchServerConfig();
  useFetchUserConfig(!isLoading);

  useEnabledDataSync();

  const useStoreUpdater = createStoreUpdater(useGlobalStore);

  const mobile = useIsMobile();
  const router = useRouter();

  useStoreUpdater('isMobile', mobile);
  useStoreUpdater('router', router);

  // Import settings from the url
  const { importSettings } = useImportConfig();
  const settings = useSearchParams().get(LOBE_URL_IMPORT_NAME);
  useEffect(() => {
    importSettings(settings);
  }, [router, importSettings]);

  useEffect(() => {
    router.prefetch('/chat');
    router.prefetch('/chat/settings');
    router.prefetch('/market');
    router.prefetch('/settings/common');
    router.prefetch('/settings/agent');
    router.prefetch('/settings/sync');
  }, [router]);

  return null;
});

export default StoreInitialization;
