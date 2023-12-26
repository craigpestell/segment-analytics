import { NextRouter } from 'next/router';
import {
  IdentifyParams,
  Analytics as SegmentAnalytics,
  TrackParams,
} from '@segment/analytics-node';

import Analytics, {
  type PageViewProps,
  SEGMENT_WRITE_KEY,
  type EventType,
} from '../lib/analytics';
import { useEffect, useState } from 'react';

export const useAnalytics = ({ Auth0Id }: { Auth0Id?: string }) => {
  // const analytics = new SegmentAnalytics({ writeKey: SEGMENT_WRITE_KEY });
  const analytics = Analytics();
  return {
    track: ({
      type = 'track',
      event,
      properties,
    }: {
      type?: EventType;
      event: string;
      properties: Object;
    }) => {
      const trackParams = {
        Auth0Id: Auth0Id ?? '',
        event,
        type,
        properties: {
          ...properties,
        },
      };

      analytics.track(trackParams);
    },
  };
};

export interface UsePageViewProps extends PageViewProps {
  router?: NextRouter;
}
export const usePageView = ({
  router,
  Auth0Id,
  category,
  name,
  properties,
}: UsePageViewProps) => {
  function isEqualShallow(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  const analytics = Analytics({ router });
  const [timestamp, setTimestamp] = useState<number>(0);
  const [pageViewProps, setPageViewProps] = useState<PageViewProps>({
    Auth0Id,
    category,
    name,
    properties,
  });

  useEffect(() => {
    const now = Math.round(Date.now() / 1000);

    const sameProps = isEqualShallow(
      { Auth0Id, category, name, properties },
      pageViewProps,
    );

    const paramsResolved =
      !router?.pathname.includes('[id]') &&
      !router?.pathname.includes('[...id]')
        ? true
        : !!router.query.id;

    const pageViewTimeThresholdMet = now - timestamp > 30;
    console.log({ timestamp });
    //console.log({ pageViewTimeThresholdMet, now, timestamp });
    if (Auth0Id && paramsResolved && (!sameProps || pageViewTimeThresholdMet)) {
      setTimestamp(now);

      setPageViewProps({
        Auth0Id,
        category,
        name,
        properties,
      });

      analytics.pageview({ Auth0Id, category, name, properties });
    }
  }, [
    Auth0Id,
    category,
    name,
    properties,
    pageViewProps,
    analytics,
    timestamp,
  ]);
};

export default { useAnalytics, usePageView };
