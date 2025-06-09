import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { QuestionnaireFormData } from "@shared/schema";

interface MarriageInfoSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export default function MarriageInfoSection({ form }: MarriageInfoSectionProps) {
  const hasChildren = form.watch("hasChildren");

  return (
    <div className="section-card bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-navy-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          2
        </div>
        <h2 className="text-xl font-semibold text-navy-800">혼인 정보</h2>
      </div>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="marriageType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-gray-700">혼인신고 여부 *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="법적혼인" id="legal-marriage" />
                    <label htmlFor="legal-marriage">법적혼인</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="사실혼" id="common-law" />
                    <label htmlFor="common-law">사실혼</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="미혼동거" id="cohabitation" />
                    <label htmlFor="cohabitation">미혼동거</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="marriageDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">결혼 날짜</FormLabel>
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
            name="marriageDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">혼인 기간</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="예: 5년 3개월"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="hasChildren"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-gray-700">자녀 유무 *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="있음" id="has-children" />
                    <label htmlFor="has-children">있음</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="없음" id="no-children" />
                    <label htmlFor="no-children">없음</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {hasChildren === "있음" && (
          <FormField
            control={form.control}
            name="childrenDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">자녀 수 및 나이</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="예: 첫째 10세(남), 둘째 7세(여)"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
