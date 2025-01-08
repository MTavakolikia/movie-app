export interface AuthorDetails {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number;
}

export interface Review {
    author: string;
    author_details: AuthorDetails;
    content: string;
    created_at: string;
    id: string;
    updated_at: string;
    url: string;
}

export type Reviews = Review[];