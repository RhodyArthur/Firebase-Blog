export interface Post {
    title: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId: string;
    commentsCount: number;
}
