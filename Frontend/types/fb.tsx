export interface FacebookPost {
    blogId: number;
    pageId: string;
    postId: string;
    created: {
      dateTime: string;
      timezone: string;
    };
    timestamp: number;
    link: string;
    text: string;
    type: string;
    shares: number;
    comments: number;
    reactions: number;
    impressions: number;
    impressionsPaid: number;
    impressionsOrganic: number;
    impressionsUnique: number;
    impressionsUniquePaid: number;
    impressionsUniqueOrganic: number;
    clicks: number;
    engagement: number;
    picture: string;
    videoViews: number;
    videoViewsPaid: number;
    videoViewsOrganic: number;
    videoTimeWatched: number;
    linkclicks: number;
    spend: number;
    internalSearchId: string;
  }
  
  
  export interface InstagramPost {
    postId: string;
    userId: string;
    businessId: string;
    type: string;
    publishedAt: {
      dateTime: string;
      timezone: string;
    };
    filter: string;
    url: string;
    content: string;
    imageUrl: string;
    likes: number;
    comments: number;
    interactions: number;
    engagement: number;
    impressions: number;
    reach: number;
    saved: number;
    videoViews: number;
    impressionsTotal: number;
    videoViewsTotal: number;
  }
  
  export interface IGReel {
    reelId: string
    userId: string
    businessId: string
    type: string
    publishedAt: { dateTime: string; timezone: string }
    filter: string
    url: string
    content: string
    imageUrl: string
    likes: number
    comments: number
    interactions: number
    engagement: number
    impressions: number
    reach: number
    saved: number
    shares: number
    videoViews: number
    impressionsTotal: number
    videoViewsTotal: number
  }

  export interface FBReel {
    pageId: string
    reelId: string
    description: string
    created: { dateTime: string }
    blueReelsPlayCount: number
    postImpressionsUnique: number
    postVideoAvgTimeWatchedSeconds: number
    postVideoViewTimeSeconds: number
    postVideoReactions: number
    postVideoSocialActions: number
    videoUrl: string
    thumbnailUrl: string
    comments: string
    length: string
    reelUrl: string
    reach: string
    engagement: string
  }