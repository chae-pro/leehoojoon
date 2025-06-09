import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionnaireFormData } from "@shared/schema";

interface AssetSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const assetOptions = [
  "아파트",
  "전세보증금",
  "차량",
  "예금",
  "보험",
  "주식",
  "사업체"
];

export default function AssetSection({ form }: AssetSectionProps) {
  return (
    <div className="section-card bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-navy-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
          5
        </div>
        <h2 className="text-xl font-semibold text-navy-800">재산 정보</h2>
      </div>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="assets"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700 mb-4">
                보유 자산 (해당되는 것을 모두 선택)
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assetOptions.map((asset) => (
                  <FormField
                    key={asset}
                    control={form.control}
                    name="assets"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={asset}
                          className="flex flex-row items-center space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(asset)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), asset])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== asset)
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {asset}
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
          name="otherAssets"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">기타 자산</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="기타 보유 자산이 있다면 입력해주세요"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="assetAgreement"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-gray-700">재산 합의 여부</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="예" id="asset-agreement-yes" />
                    <label htmlFor="asset-agreement-yes">예</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="아니오" id="asset-agreement-no" />
                    <label htmlFor="asset-agreement-no">아니오</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="협의 중" id="asset-agreement-negotiating" />
                    <label htmlFor="asset-agreement-negotiating">협의 중</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
