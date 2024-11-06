import React, { memo, useMemo } from 'react';

import { ChatItem } from '@/features/Conversation';
import ActionsBar from '@/features/Conversation/components/ChatItem/ActionsBar';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/slices/chat';
import { useChatStore } from '@/store/chat';
import { threadSelectors } from '@/store/chat/selectors';

import ThreadDivider from './ThreadDivider';

export interface ThreadChatItemProps {
  id: string;
  index: number;
}

const ThreadChatItem = memo<ThreadChatItemProps>(({ id, index }) => {
  const [threadMessageId, threadStartMessageIndex, historyLength] = useChatStore((s) => [
    threadSelectors.threadSourceMessageId(s),
    threadSelectors.threadSourceMessageIndex(s),
    threadSelectors.portalDisplayChats(s).length,
  ]);

  const enableThreadDivider = threadMessageId === id;

  const endRender = useMemo(
    () => enableThreadDivider && <ThreadDivider />,
    [enableThreadDivider, id],
  );

  const isParentMessage = index <= threadStartMessageIndex;

  const actionBar = useMemo(
    () => !isParentMessage && <ActionsBar id={id} inThread />,
    [id, isParentMessage],
  );

  const enableHistoryDivider = useAgentStore((s) => {
    const config = agentSelectors.currentAgentChatConfig(s);
    return (
      config.enableHistoryCount &&
      historyLength > (config.historyCount ?? 0) &&
      config.historyCount === historyLength - index
    );
  });

  return (
    <ChatItem
      actionBar={actionBar}
      disableEditing={isParentMessage}
      enableHistoryDivider={enableHistoryDivider}
      endRender={endRender}
      id={id}
      index={index}
    />
  );
});

export default ThreadChatItem;
