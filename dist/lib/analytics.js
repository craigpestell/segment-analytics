"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_node_1 = require("@segment/analytics-node");
const SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY || 'FVXjn6W0y5iDR11coKCRC4TBHqcAP97r';
const Analytics = ({ router }) => {
    const analytics = new analytics_node_1.Analytics({
        writeKey: `${SEGMENT_WRITE_KEY}`,
    }).on('error', console.error);
    return {
        pageview: ({ Auth0Id, category, name, properties }) => {
            /*
              {
                userId: '019mr8mf4r',
                category: 'Docs',
                name: 'Node.js Library',
                properties: {
                  url: 'https://segment.com/docs/connections/sources/catalog/librariesnode',
                  path: '/docs/connections/sources/catalog/librariesnode/',
                  title: 'Node.js Library - Segment',
                  referrer: 'https://github.com/segmentio/analytics-node'
                }
              }
              */
            if (router.pathname && Auth0Id) {
                analytics.page({
                    userId: Auth0Id,
                    category,
                    name,
                    properties: Object.assign(Object.assign({}, properties), { url: router.pathname }),
                });
            }
        },
        track: ({ Auth0Id, type = 'track', event, properties, }) => {
            const e = {
                userId: Auth0Id,
                type,
                event,
                properties: Object.assign(Object.assign({}, properties), { url: router.pathname }),
            };
            console.log('track: ', e);
            analytics.track(e);
        },
    };
};
/*
          messageId?: string
        type: SegmentEventType
      
        // page specific
        category?: string
        name?: string
      
        properties?: EventProperties
      
        traits?: Traits // Traits is only defined in 'identify' and 'group', even if it can be passed in other calls.
      
        integrations?: Integrations
        context?: CoreExtraContext
        options?: CoreOptions
      
        userId?: ID
        anonymousId?: ID
        groupId?: ID
        previousId?: ID
      
        event?: string
      
        writeKey?: string
      
        sentAt?: Date
      
        _metadata?: SegmentEventMetadata
      
        timestamp?: Timestamp */
exports.default = Analytics;
//# sourceMappingURL=analytics.js.map