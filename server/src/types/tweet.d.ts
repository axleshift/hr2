export interface TweetType {
    id_str: string;
}

export interface ITweet {
    data: {
        id: string;
    };
    errors?: unknown;
}
