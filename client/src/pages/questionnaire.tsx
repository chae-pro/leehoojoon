import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { questionnaireFormSchema, type QuestionnaireFormData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import BasicInfoSection from "@/components/questionnaire/BasicInfoSection";
import MarriageInfoSection from "@/components/questionnaire/MarriageInfoSection";
import DivorceReasonsSection from "@/components/questionnaire/DivorceReasonsSection";
import SeparationSection from "@/components/questionnaire/SeparationSection";
import AssetSection from "@/components/questionnaire/AssetSection";
import DebtSection from "@/components/questionnaire/DebtSection";
import ChildCareSection from "@/components/questionnaire/ChildCareSection";
import LegalProceduresSection from "@/components/questionnaire/LegalProceduresSection";
import ConsultationPurposeSection from "@/components/questionnaire/ConsultationPurposeSection";
import ConsentSection from "@/components/questionnaire/ConsentSection";
import ProgressBar from "@/components/questionnaire/ProgressBar";
import SuccessModal from "@/components/questionnaire/SuccessModal";
import { useFormProgress } from "@/hooks/useFormProgress";
import { generatePDF } from "@/lib/pdfGenerator";
import { sendEmail } from "@/lib/emailService";

export default function Questionnaire() {
  const { toast } = useToast();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireFormSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      spouseName: "",
      spouseBirthDate: "",
      marriageType: "",
      marriageDate: "",
      marriageDuration: "",
      hasChildren: "",
      childrenDetails: "",
      divorceReasons: [],
      otherReasons: "",
      separated: "",
      separationStartDate: "",
      separationReason: "",
      assets: [],
      otherAssets: "",
      assetAgreement: "",
      totalDebt: "",
      debtHolder: "",
      spouseAwareness: "",
      custodyWish: "",
      alimonyPlan: "",
      spouseInvolvement: [],
      pastLegalProcedures: [],
      otherLegalProcedures: "",
      ongoingLegalProcedures: "",
      consultationGoals: "",
      concerns: "",
      privacyConsent: false,
      emailConsent: false,
    },
  });

  const { progress } = useFormProgress(form);

  // Auto-save form data to localStorage
  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem('divorceFormData', JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('divorceFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach((key) => {
          if (parsedData[key] !== undefined && parsedData[key] !== null) {
            form.setValue(key as keyof QuestionnaireFormData, parsedData[key]);
          }
        });
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [form]);

  // Prevent accidental page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsavedData = localStorage.getItem('divorceFormData');
      if (hasUnsavedData) {
        e.preventDefault();
        e.returnValue = '작성 중인 내용이 있습니다. 정말 페이지를 떠나시겠습니까?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (data: QuestionnaireFormData) => {
      const submitData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        formData: data,
        submittedAt: new Date().toISOString(),
      };
      
      return await apiRequest("POST", "/api/questionnaires", submitData);
    },
    onSuccess: async (response, data) => {
      try {
        // Generate PDF
        const pdfBlob = await generatePDF(data);
        setGeneratedPdfBlob(pdfBlob);

        // Send email
        await sendEmail(data, pdfBlob);

        // Clear saved form data
        localStorage.removeItem('divorceFormData');
        
        // Show success modal
        setShowSuccessModal(true);
        
        toast({
          title: "제출 완료",
          description: "설문지가 성공적으로 제출되었습니다.",
        });
      } catch (error) {
        console.error('Error in post-submission process:', error);
        toast({
          title: "제출 완료",
          description: "설문지는 제출되었지만 일부 기능에서 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Submission error:', error);
      toast({
        title: "제출 실패",
        description: "설문지 제출 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuestionnaireFormData) => {
    submitMutation.mutate(data);
  };

  const handleDownloadPdf = () => {
    if (generatedPdfBlob) {
      const url = URL.createObjectURL(generatedPdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '이혼상담_사전설문지.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy-800 mb-2">이혼 상담 사전 설문지</h1>
            <p className="text-gray-600">전문적인 상담을 위한 사전 정보 수집</p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoSection form={form} />
            <MarriageInfoSection form={form} />
            <DivorceReasonsSection form={form} />
            <SeparationSection form={form} />
            <AssetSection form={form} />
            <DebtSection form={form} />
            <ChildCareSection form={form} />
            <LegalProceduresSection form={form} />
            <ConsultationPurposeSection form={form} />
            <ConsentSection form={form} />

            {/* Submit Button */}
            <div className="text-center py-8">
              <Button 
                type="submit" 
                disabled={submitMutation.isPending}
                className="bg-navy-600 hover:bg-navy-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    제출 중...
                  </>
                ) : (
                  "설문지 제출하기"
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                제출 시 설문지가 PDF로 생성되어 담당 변호사에게 전송됩니다.
              </p>
            </div>
          </form>
        </Form>
      </main>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
}
