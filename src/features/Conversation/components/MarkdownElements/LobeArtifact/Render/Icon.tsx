import { Icon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { CodeXml, SparkleIcon } from 'lucide-react';
import { memo } from 'react';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  container: css`
    cursor: pointer;

    margin-block-start: 12px;

    color: ${token.colorText};

    border: 1px solid ${token.colorBorder};
    border-radius: 8px;

    &:hover {
      background: ${isDarkMode ? '' : token.colorFillSecondary};
    }
  `,

  desc: css`
    color: ${token.colorTextTertiary};
  `,
  title: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    font-size: 16px;
    text-overflow: ellipsis;
  `,
}));

interface ArtifactProps {
  type: string;
}

const ArtifactIcon = memo<ArtifactProps>(({ type }) => {
  const { theme } = useStyles();

  if (type === 'image/svg+xml') {
    return (
      <Icon icon={CodeXml} size={{ fontSize: 28 }} style={{ color: theme.colorTextSecondary }} />
    );
  }

  return <Icon color={theme.purple} icon={SparkleIcon} />;
});

export default ArtifactIcon;
