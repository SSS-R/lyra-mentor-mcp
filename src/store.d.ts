export interface Challenge {
    id: string;
    track: string;
    title: string;
    description: string;
    hints: string[];
    status: 'active' | 'completed' | 'archived';
    created_at: string;
}
export interface Submission {
    id: string;
    challenge_id: string;
    lyra_notes: string;
    submitted_at: string;
    status: 'pending_review' | 'reviewed';
}
export interface Review {
    id: string;
    submission_id: string;
    feedback: string;
    grade: 'pass' | 'needs-work' | 'fail';
    next_challenge_id?: string;
    reviewed_at: string;
}
export interface Curriculum {
    tracks: {
        id: string;
        name: string;
        milestones: {
            id: string;
            title: string;
        }[];
    }[];
}
declare class Store {
    readJson<T>(filename: string): Promise<T>;
    writeJson<T>(filename: string, data: T): Promise<void>;
    getChallenges(): Promise<Challenge[]>;
    saveChallenges(challenges: Challenge[]): Promise<void>;
    getSubmissions(): Promise<Submission[]>;
    saveSubmissions(submissions: Submission[]): Promise<void>;
    getReviews(): Promise<Review[]>;
    saveReviews(reviews: Review[]): Promise<void>;
    getCurriculum(): Promise<Curriculum>;
}
export declare const store: Store;
export {};
//# sourceMappingURL=store.d.ts.map