export interface Post {
    id: string,
    title: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId: string;
    authorName?: string;
    commentsCount: number;
}
