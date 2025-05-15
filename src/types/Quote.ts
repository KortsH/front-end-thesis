export interface Quote {
  id: number;
  platform: string;
  poster: string;
  post_id: string;
  content: string;
  post_time: string;
  tweet_url?: string;
}