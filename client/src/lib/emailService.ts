import { QuestionnaireFormData } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function sendEmail(data: QuestionnaireFormData, pdfBlob: Blob): Promise<void> {
  try {
    // Convert PDF blob to base64
    const base64data = await blobToBase64(pdfBlob);

    // Send email via server endpoint
    await apiRequest("POST", "/api/send-email", {
      formData: data,
      pdfData: base64data
    });

    console.log('Email sent successfully via server');
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw error to avoid breaking the user experience
    // The form was submitted successfully even if email fails
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:application/pdf;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
