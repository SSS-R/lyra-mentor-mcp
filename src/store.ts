import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

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
    milestones: { id: string; title: string }[];
  }[];
}

class Store {
  async readJson<T>(filename: string): Promise<T> {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async writeJson<T>(filename: string, data: T): Promise<void> {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getChallenges(): Promise<Challenge[]> {
    return this.readJson<Challenge[]>('challenges.json');
  }

  async saveChallenges(challenges: Challenge[]): Promise<void> {
    await this.writeJson('challenges.json', challenges);
  }

  async getSubmissions(): Promise<Submission[]> {
    return this.readJson<Submission[]>('submissions.json');
  }

  async saveSubmissions(submissions: Submission[]): Promise<void> {
    await this.writeJson('submissions.json', submissions);
  }

  async getReviews(): Promise<Review[]> {
    return this.readJson<Review[]>('reviews.json');
  }

  async saveReviews(reviews: Review[]): Promise<void> {
    await this.writeJson('reviews.json', reviews);
  }

  async getCurriculum(): Promise<Curriculum> {
    return this.readJson<Curriculum>('curriculum.json');
  }
}

export const store = new Store();
