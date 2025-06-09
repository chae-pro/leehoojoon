import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionnaireFormData } from "@shared/schema";

interface ConsentSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export default function ConsentSection({ form }: ConsentSectionProps) {
  return (
    <div className="section-card bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-navy-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          10
        </div>
        <h2 className="text-xl font-semibold text-navy-800">개인정보 처리 동의</h2>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">개인정보 수집 및 이용 안내</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>수집목적:</strong> 이혼 상담을 위한 사전자료 수집 및 분석</p>
          <p><strong>수집항목:</strong> 설문지에 작성된 모든 정보</p>
          <p><strong>보유기간:</strong> 상담 완료 후 1년간 보관 후 파기</p>
          <p><strong>제3자 제공:</strong> 본인의 동의 없이 제3자에게 제공되지 않습니다</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="privacyConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  본 설문지는 이혼 상담을 위한 사전자료로만 활용되며, 제3자에게 제공되지 않습니다. 
                  <span className="text-red-600"> *</span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emailConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  작성된 설문지가 담당 변호사에게 이메일로 전송되는 것에 동의합니다. 
                  <span className="text-red-600"> *</span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
