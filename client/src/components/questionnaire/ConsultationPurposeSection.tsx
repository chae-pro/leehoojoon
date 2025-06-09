import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { QuestionnaireFormData } from "@shared/schema";

interface ConsultationPurposeSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export default function ConsultationPurposeSection({ form }: ConsultationPurposeSectionProps) {
  return (
    <div className="section-card bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-navy-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          9
        </div>
        <h2 className="text-xl font-semibold text-navy-800">상담 목적 및 기대사항</h2>
      </div>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="consultationGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">상담을 통해 알고 싶은 점</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="이혼 상담을 통해 구체적으로 알고 싶은 내용을 자세히 작성해주세요"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="concerns"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">걱정되거나 신경쓰이는 부분</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="현재 가장 걱정되거나 신경쓰이는 부분을 구체적으로 설명해주세요"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
