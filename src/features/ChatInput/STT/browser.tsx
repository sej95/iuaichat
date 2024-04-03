import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useBrowserSTT } from '@/hooks/useSTT';
import { useChatStore } from '@/store/chat';
import { ChatMessageError } from '@/types/message';
import { getMessageError } from '@/utils/fetch';
import CommonSTT from './common';

const BrowserSTT = memo<{ mobile?: boolean }>(({ mobile }) => {
  const [error, setError] = useState<ChatMessageError>();
  const { t } = useTranslation('chat');

  const [loading, updateInputMessage] = useChatStore((s) => [
    !!s.chatLoadingId,
    s.updateInputMessage,
  ]);

  const setDefaultError = useCallback(
    (err?: any) => {
      setError({ body: err, message: t('stt.responseError', { ns: 'error' }), type: 500 });
    },
    [t],
  );

  const { start, isLoading, stop, formattedTime, time, response, isRecording } = useBrowserSTT({
    onError: (err) => {
      stop();
      setDefaultError(err);
    },
    onErrorRetry: (err) => {
      stop();
      setDefaultError(err);
    },
    onSuccess: async () => {
      if (!response) return;
      if (response.status === 200) return;
      const message = await getMessageError(response);
      if (message) {
        setError(message);
      } else {
        setDefaultError();
      }
      stop();
    },
    onTextChange: (text) => {
      if (loading) stop();
      if (text) updateInputMessage(text);
    },
  });

  const desc = t('stt.action');

  const handleTriggerStartStop = useCallback(() => {
    if (loading) return;
    if (!isLoading) {
      start();
    } else {
      stop();
    }
  }, [loading, isLoading, start, stop]);

  const handleCloseError = useCallback(() => {
    setError(undefined);
    stop();
  }, [stop]);

  const handleRetry = useCallback(() => {
    setError(undefined);
    start();
  }, [start]);

  return (
    <CommonSTT 
      desc={desc}
      error={error}
      formattedTime={formattedTime}
      handleCloseError={handleCloseError} 
      handleRetry={handleRetry}
      handleTriggerStartStop={handleTriggerStartStop} 
      isLoading={isLoading}
      isRecording={isRecording}
      mobile={mobile} 
      time={time}
      />
  )
});

export default BrowserSTT;
