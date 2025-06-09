import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionnaireFormData } from "@shared/schema";

interface SeparationSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export default function SeparationSection({ form }: SeparationSectionProps) {
  const separated = form.watch("separated");

  return (
    <div className="section-card bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-navy-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          4
        </div>
        <h2 className="text-xl font-semibold text-navy-800">별거 여부</h2>
      </div>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="separated"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-gray-700">현재 별거 중이신가요? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="예" id="separated-yes" />
                    <label htmlFor="separated-yes">예</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="아니오" id="separated-no" />
                    <label htmlFor="separated-no">아니오</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {separated === "예" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="separationStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">별거 시작 시점</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="separationReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">별거 원인</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
