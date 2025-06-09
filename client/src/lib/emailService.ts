import { QuestionnaireFormData } from "@shared/schema";

declare global {
  interface Window {
    emailjs: any;
  }
}

export async function sendEmail(data: QuestionnaireFormData, pdfBlob: Blob): Promise<void> {
  // Initialize EmailJS with your user ID
  const emailjsUserId = import.meta.env.VITE_EMAILJS_USER_ID || "YOUR_EMAILJS_USER_ID";
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";

  try {
    // Initialize EmailJS
    if (window.emailjs) {
      window.emailjs.init(emailjsUserId);

      // Convert PDF blob to base64
      const base64data = await blobToBase64(pdfBlob);

      const templateParams = {
        to_email: 'computerschool100@gmail.com',
        client_name: data.name || '익명',
        client_email: data.email || '',
        client_phone: data.phone || '',
        marriage_type: data.marriageType || '',
        has_children: data.hasChildren || '',
        separated: data.separated || '',
        consultation_goals: data.consultationGoals || '',
        concerns: data.concerns || '',
        attachment: base64data,
        submission_date: new Date().toLocaleDateString('ko-KR'),
        message: '새로운 이혼 상담 사전 설문지가 제출되었습니다.'
      };

      const response = await window.emailjs.send(serviceId, templateId, templateParams);
      console.log('Email sent successfully:', response);
    } else {
      throw new Error('EmailJS not loaded');
    }
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
