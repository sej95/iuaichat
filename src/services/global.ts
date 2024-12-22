import { DeepPartial } from 'utility-types';

import { edgeClient } from '@/libs/trpc/client';
import { LobeAgentConfig } from '@/types/agent';
import { GlobalServerConfig } from '@/types/serverConfig';

const VERSION_URL = 'https://registry.npmmirror.com/@lobehub/chat/latest';

class GlobalService {
  /**
   * get latest version from npm
   */
  getLatestVersion = async (): Promise<string> => {
    const res = await fetch(VERSION_URL);
    const data = await res.json();

    return data['version'];
  };

  getLatestChangelogId = async (): Promise<string> => {
    return edgeClient.appStatus.getLatestChangelogId.query();
  };

  getGlobalConfig = async (): Promise<GlobalServerConfig> => {
    return edgeClient.config.getGlobalConfig.query();
  };

  getDefaultAgentConfig = async (): Promise<DeepPartial<LobeAgentConfig>> => {
    return edgeClient.config.getDefaultAgentConfig.query();
  };
}

export const globalService = new GlobalService();
