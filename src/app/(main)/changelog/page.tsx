import { Divider, Skeleton } from 'antd';
import { Fragment, Suspense } from 'react';
import { Flexbox } from 'react-layout-kit';

import Pagination from '@/app/@modal/(.)changelog/features/Pagination';
import StructuredData from '@/components/StructuredData';
import { BRANDING_NAME } from '@/const/branding';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { ChangelogService } from '@/server/services/changelog';
import { translation } from '@/server/translation';
import { isMobileDevice } from '@/utils/server/responsive';

import GridLayout from './features/GridLayout';
import Post from './features/Post';

export const generateMetadata = async () => {
  const { t } = await translation('metadata');
  return metadataModule.generate({
    description: t('changelog.description', { appName: BRANDING_NAME }),
    title: t('changelog.title'),
    url: '/changelog',
  });
};

const Page = async () => {
  const mobile = isMobileDevice();
  const { t, locale } = await translation('metadata');
  const changelogService = new ChangelogService();
  const data = await changelogService.getChangelogIndex();

  const ld = ldModule.generate({
    description: t('changelog.description', { appName: BRANDING_NAME }),
    title: t('changelog.title', { appName: BRANDING_NAME }),
    url: '/changelog',
  });

  return (
    <>
      <StructuredData ld={ld} />
      <Flexbox gap={48}>
        {data.map((item) => (
          <Fragment key={item.id}>
            <Suspense
              fallback={
                <GridLayout>
                  <Divider />
                  <Skeleton active paragraph={{ rows: 5 }} />
                </GridLayout>
              }
            >
              <Post locale={locale} mobile={mobile} {...item} />
            </Suspense>
          </Fragment>
        ))}
      </Flexbox>
      <GridLayout>
        <Pagination />
      </GridLayout>
    </>
  );
};

export default Page;
