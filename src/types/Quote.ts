export interface Quote {
  id:         number;
  platform:   string;
  poster:     string;
  post_id:    string;
  content:    string;
  post_time:  string;
  tweet_url?: string;

  // for hashed mode:
  commitment?: string;
  proof?: {
    index:        number;
    timestamp:    number;
    hash:         string;
    previousHash: string;
    nonce:        number;
  };
}
