import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { QuestionnaireFormData } from "@shared/schema";

export function useFormProgress(form: UseFormReturn<QuestionnaireFormData>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscription = form.watch((data) => {
      const requiredFields = [
        'name', 'birthDate', 'gender', 'phone', 'email', 'address',
        'marriageType', 'hasChildren', 'separated', 'privacyConsent', 'emailConsent'
      ];

      let filledFields = 0;
      let totalFields = requiredFields.length;

      requiredFields.forEach((field) => {
        const value = data[field as keyof QuestionnaireFormData];
        if (field === 'privacyConsent' || field === 'emailConsent') {
          if (value === true) filledFields++;
        } else if (value && value !== '') {
          filledFields++;
        }
      });

      // Add optional fields to total and check if filled
      const optionalFields = [
        'spouseName', 'spouseBirthDate', 'marriageDate', 'marriageDuration',
        'childrenDetails', 'divorceReasons', 'otherReasons', 'separationStartDate',
        'separationReason', 'assets', 'otherAssets', 'assetAgreement',
        'totalDebt', 'debtHolder', 'spouseAwareness', 'custodyWish',
        'alimonyPlan', 'spouseInvolvement', 'pastLegalProcedures',
        'otherLegalProcedures', 'ongoingLegalProcedures', 'consultationGoals', 'concerns'
      ];

      optionalFields.forEach((field) => {
        const value = data[field as keyof QuestionnaireFormData];
        totalFields++;
        if (Array.isArray(value)) {
          if (value.length > 0) filledFields++;
        } else if (value && value !== '') {
          filledFields++;
        }
      });

      const progressPercentage = (filledFields / totalFields) * 100;
      setProgress(Math.min(progressPercentage, 100));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return { progress };
}
