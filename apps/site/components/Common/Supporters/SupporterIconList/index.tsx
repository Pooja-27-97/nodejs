'use client';

import { useEffect, useRef, useState, type FC } from 'react';

import SupporterIcon from '@/components/Common/Supporters/SupporterIcon';
import { randomSupporterList } from '@/components/Common/Supporters/utils';
import { DEFAULT_SUPPORTERS_LIST } from '@/next.supporters.constants';
import type { Supporter } from '@/types';

type SupporterIconListProps = {
  supporters: Array<Supporter>;
  maxLength?: number;
};

const SupporterIconList: FC<SupporterIconListProps> = ({
  supporters,
  maxLength = 4,
}) => {
  const initialRenderer = useRef(true);

  const [seedList, setSeedList] = useState<Array<Supporter>>(
    DEFAULT_SUPPORTERS_LIST
  );

  useEffect(() => {
    // We intentionally render the initial default "mock" list of sponsors
    // to have the Skeletons loading, and then we render the actual list
    // after an enough amount of time has passed to give a proper sense of Animation
    // We do this client-side effect, to ensure that a random-amount of sponsors is renderered
    // on every page load. Since our page is natively static, we need to ensure that
    // on the client-side we have a random amount of sponsors rendered.
    // Although whilst we are deployed on Vercel or other environment that supports ISR
    // (Incremental Static Generation) whose would invalidate the cache every 5 minutes
    // We want to ensure that this feature is compatible on a full-static environment
    const renderSponsorsAnimation = setTimeout(() => {
      initialRenderer.current = false;

      setSeedList(
        randomSupporterList(
          supporters,
          Math.max(supporters.length, maxLength * 2)
        )
      );
    }, 1000);

    return () => clearTimeout(renderSponsorsAnimation);
    // We only want this to run once on initial render
    // We don't really care if the props change as realistically they shouldn't ever
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
      {seedList.slice(0, maxLength).map((supporter, index) => (
        <SupporterIcon
          {...supporter}
          loading={initialRenderer.current}
          key={index}
        />
      ))}
    </div>
  );
};

export default SupporterIconList;
