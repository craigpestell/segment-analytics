import {
  IdentifyParams,
  PageParams,
  Analytics as SegmentAnalytics,
  TrackParams,
} from '@segment/analytics-node';

//const analytics = AnalyticsBrowser.load({ writeKey: process.env.WRITE_KEY as string })

export type EventType =
  | 'track'
  | 'page'
  | 'identify'
  | 'group'
  | 'alias'
  | 'screen';

export type PageViewProps = {
  Auth0Id: string;
  category: string;
  name: string;
  properties?: Object;
};

const Analytics = (writeKey: string) => {
  const segmentAnalytics = new SegmentAnalytics({
    writeKey,
  }).on('error', console.error);

  const methods = {
    identify: async ({
      userId,
      anonymousId,
      traits,
      context,
      timestamp,
      integrations,
    }: IdentifyParams) => {
      if (userId) {
        return await new Promise((resolve) =>
          resolve(
            segmentAnalytics.identify({
              userId,
              traits,
              context,
              timestamp,
              integrations,
            }),
          ),
        );
      }
      if (anonymousId) {
        return await new Promise((resolve) =>
          resolve(
            segmentAnalytics.identify({
              anonymousId,
              traits,
              context,
              timestamp,
              integrations,
            }),
          ),
        );
      }
    },
    pageview: async ({
      Auth0Id,
      category,
      name,
      properties,
    }: PageViewProps) => {
      const pageParams: PageParams = {
        userId: Auth0Id,
        category,
        name,
        properties: {
          ...properties,
        },
      };

      console.log('page:', pageParams);
      return new Promise((resolve) =>
        resolve(segmentAnalytics.page(pageParams)),
      );
    },
    track: async ({
      Auth0Id,
      //type = 'track',
      event,
      properties,
    }: {
      Auth0Id: string;
      type?: EventType;
      event: string;
      properties?: Object;
    }) => {
      const identifyParams: IdentifyParams = Auth0Id
        ? { userId: Auth0Id }
        : { anonymousId: 'anonymous' };

      const trackParams: TrackParams = {
        event: event ?? 'no event specified',
        properties: {
          ...properties,
        },
        ...identifyParams,
      };

      return new Promise((resolve) =>
        resolve(segmentAnalytics.track(trackParams)),
      );
    },
  };

  return { ...methods };
};
export default Analytics;
