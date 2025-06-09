import { questionnaires, type Questionnaire, type InsertQuestionnaire } from "@shared/schema";

export interface IStorage {
  getQuestionnaire(id: number): Promise<Questionnaire | undefined>;
  createQuestionnaire(questionnaire: InsertQuestionnaire): Promise<Questionnaire>;
  getAllQuestionnaires(): Promise<Questionnaire[]>;
}

export class MemStorage implements IStorage {
  private questionnaires: Map<number, Questionnaire>;
  private currentId: number;

  constructor() {
    this.questionnaires = new Map();
    this.currentId = 1;
  }

  async getQuestionnaire(id: number): Promise<Questionnaire | undefined> {
    return this.questionnaires.get(id);
  }

  async createQuestionnaire(insertQuestionnaire: InsertQuestionnaire): Promise<Questionnaire> {
    const id = this.currentId++;
    const questionnaire: Questionnaire = { 
      ...insertQuestionnaire, 
      id 
    };
    this.questionnaires.set(id, questionnaire);
    return questionnaire;
  }

  async getAllQuestionnaires(): Promise<Questionnaire[]> {
    return Array.from(this.questionnaires.values());
  }
}

export const storage = new MemStorage();
