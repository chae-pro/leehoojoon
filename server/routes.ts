import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionnaireSchema } from "@shared/schema";
import { sendQuestionnaireEmail } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit questionnaire
  app.post("/api/questionnaires", async (req, res) => {
    try {
      const validatedData = insertQuestionnaireSchema.parse(req.body);
      const questionnaire = await storage.createQuestionnaire(validatedData);
      res.json({ success: true, id: questionnaire.id });
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      res.status(400).json({ 
        success: false, 
        message: "Invalid questionnaire data" 
      });
    }
  });

  // Send questionnaire email with PDF
  app.post("/api/send-email", async (req, res) => {
    try {
      const { formData, pdfData } = req.body;
      
      if (!formData || !pdfData) {
        return res.status(400).json({
          success: false,
          message: "Missing form data or PDF data"
        });
      }

      // Convert base64 PDF data to buffer
      const pdfBuffer = Buffer.from(pdfData, 'base64');
      
      // Send email
      const emailSent = await sendQuestionnaireEmail(formData, pdfBuffer);
      
      if (emailSent) {
        res.json({ success: true, message: "Email sent successfully" });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send email" 
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ 
        success: false, 
        message: "Email service error" 
      });
    }
  });

  // Get all questionnaires (for admin purposes)
  app.get("/api/questionnaires", async (req, res) => {
    try {
      const questionnaires = await storage.getAllQuestionnaires();
      res.json(questionnaires);
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching questionnaires" 
      });
    }
  });

  // Get specific questionnaire
  app.get("/api/questionnaires/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const questionnaire = await storage.getQuestionnaire(id);
      
      if (!questionnaire) {
        return res.status(404).json({ 
          success: false, 
          message: "Questionnaire not found" 
        });
      }
      
      res.json(questionnaire);
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching questionnaire" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
