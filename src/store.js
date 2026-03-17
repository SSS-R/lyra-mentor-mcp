"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.join(__dirname, '..', 'data');
class Store {
    async readJson(filename) {
        const filePath = path_1.default.join(DATA_DIR, filename);
        const data = await promises_1.default.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }
    async writeJson(filename, data) {
        const filePath = path_1.default.join(DATA_DIR, filename);
        await promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2));
    }
    async getChallenges() {
        return this.readJson('challenges.json');
    }
    async saveChallenges(challenges) {
        await this.writeJson('challenges.json', challenges);
    }
    async getSubmissions() {
        return this.readJson('submissions.json');
    }
    async saveSubmissions(submissions) {
        await this.writeJson('submissions.json', submissions);
    }
    async getReviews() {
        return this.readJson('reviews.json');
    }
    async saveReviews(reviews) {
        await this.writeJson('reviews.json', reviews);
    }
    async getCurriculum() {
        return this.readJson('curriculum.json');
    }
}
exports.store = new Store();
//# sourceMappingURL=store.js.map