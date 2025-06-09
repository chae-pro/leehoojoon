import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionnaireFormData } from "@shared/schema";

interface LegalProceduresSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const legalProcedureOptions = [
  "이혼소송",
  "경찰신고",
  "접근금지신청",
  "조정절차"
];

export default function LegalProceduresSection({ form }: LegalProceduresSectionProps) {
  return (
    <div className="section-card bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-navy-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          8
        </div>
        <h2 className="text-xl font-semibold text-navy-800">과거 법적 절차 여부</h2>
      </div>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="pastLegalProcedures"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 mb-4">
                과거 진행한 법적 절차 (해당되는 것을 모두 선택)
              </FormLabel>
              <div className="space-y-3">
                {legalProcedureOptions.map((procedure) => (
                  <FormField
                    key={procedure}
                    control={form.control}
                    name="pastLegalProcedures"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={procedure}
                          className="flex flex-row items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(procedure)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), procedure])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== procedure)
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {procedure}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="otherLegalProcedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">기타 법적 절차</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="기타 진행한 법적 절차가 있다면 입력해주세요"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ongoingLegalProcedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">현재 진행 중인 법적 절차</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="현재 진행 중인 법적 절차가 있다면 상세히 설명해주세요"
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
