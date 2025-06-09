import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const questionnaires = pgTable("questionnaires", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  formData: json("form_data").notNull(),
  submittedAt: text("submitted_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuestionnaireSchema = createInsertSchema(questionnaires).pick({
  name: true,
  email: true,
  phone: true,
  formData: true,
  submittedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type Questionnaire = typeof questionnaires.$inferSelect;

export const questionnaireFormSchema = z.object({
  // Basic Information
  name: z.string().min(1, "이름을 입력해주세요"),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  gender: z.string().min(1, "성별을 선택해주세요"),
  phone: z.string().min(1, "연락처를 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  spouseName: z.string().optional(),
  spouseBirthDate: z.string().optional(),
  
  // Marriage Information
  marriageType: z.string().min(1, "혼인신고 여부를 선택해주세요"),
  marriageDate: z.string().optional(),
  marriageDuration: z.string().optional(),
  hasChildren: z.string().min(1, "자녀 유무를 선택해주세요"),
  childrenDetails: z.string().optional(),
  
  // Divorce Reasons
  divorceReasons: z.array(z.string()).optional(),
  otherReasons: z.string().optional(),
  
  // Separation
  separated: z.string().min(1, "별거 여부를 선택해주세요"),
  separationStartDate: z.string().optional(),
  separationReason: z.string().optional(),
  
  // Assets
  assets: z.array(z.string()).optional(),
  otherAssets: z.string().optional(),
  assetAgreement: z.string().optional(),
  
  // Debt
  totalDebt: z.string().optional(),
  debtHolder: z.string().optional(),
  spouseAwareness: z.string().optional(),
  
  // Child Care
  custodyWish: z.string().optional(),
  alimonyPlan: z.string().optional(),
  spouseInvolvement: z.array(z.string()).optional(),
  
  // Legal Procedures
  pastLegalProcedures: z.array(z.string()).optional(),
  otherLegalProcedures: z.string().optional(),
  ongoingLegalProcedures: z.string().optional(),
  
  // Consultation Purpose
  consultationGoals: z.string().optional(),
  concerns: z.string().optional(),
  
  // Consent
  privacyConsent: z.boolean().refine(val => val === true, "개인정보 처리 동의가 필요합니다"),
  emailConsent: z.boolean().refine(val => val === true, "이메일 전송 동의가 필요합니다"),
});

export type QuestionnaireFormData = z.infer<typeof questionnaireFormSchema>;
