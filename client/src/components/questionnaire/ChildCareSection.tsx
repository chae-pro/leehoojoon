import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionnaireFormData } from "@shared/schema";

interface ChildCareSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const spouseInvolvementOptions = [
  "경제적",
  "정기적 만남",
  "전혀 없음"
];

export default function ChildCareSection({ form }: ChildCareSectionProps) {
  return (
    <div className="section-card bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-navy-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          7
        </div>
        <h2 className="text-xl font-semibold text-navy-800">양육 관련</h2>
      </div>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="custodyWish"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-gray-700">주양육권 희망 여부</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="예" id="custody-yes" />
                    <label htmlFor="custody-yes">예</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="아니오" id="custody-no" />
                    <label htmlFor="custody-no">아니오</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="협의 가능" id="custody-negotiable" />
                    <label htmlFor="custody-negotiable">협의 가능</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="alimonyPlan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-gray-700">양육비 청구 예정</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="예" id="alimony-yes" />
                    <label htmlFor="alimony-yes">예</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="아니오" id="alimony-no" />
                    <label htmlFor="alimony-no">아니오</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="협의 중" id="alimony-negotiating" />
                    <label htmlFor="alimony-negotiating">협의 중</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="spouseInvolvement"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 mb-4">상대방의 양육 관여</FormLabel>
              <div className="space-y-3">
                {spouseInvolvementOptions.map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name="spouseInvolvement"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option}
                          className="flex flex-row items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), option])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== option)
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option}
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
      </div>
    </div>
  );
}
