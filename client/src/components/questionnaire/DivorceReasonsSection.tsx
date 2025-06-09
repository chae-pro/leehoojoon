import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionnaireFormData } from "@shared/schema";

interface DivorceReasonsSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const divorceReasonOptions = [
  "성격차이",
  "외도/불륜",
  "폭력",
  "경제적 문제",
  "무책임",
  "종교/가족갈등",
  "고부갈등"
];

export default function DivorceReasonsSection({ form }: DivorceReasonsSectionProps) {
  return (
    <div className="section-card bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-navy-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          3
        </div>
        <h2 className="text-xl font-semibold text-navy-800">이혼 사유</h2>
      </div>
      
      <div>
        <FormField
          control={form.control}
          name="divorceReasons"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 mb-4">
                해당되는 사유를 모두 선택해주세요
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {divorceReasonOptions.map((reason) => (
                  <FormField
                    key={reason}
                    control={form.control}
                    name="divorceReasons"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={reason}
                          className="flex flex-row items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(reason)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), reason])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== reason)
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {reason}
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
        
        <div className="mt-4">
          <FormField
            control={form.control}
            name="otherReasons"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">기타 사유</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="기타 사유가 있다면 입력해주세요"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
