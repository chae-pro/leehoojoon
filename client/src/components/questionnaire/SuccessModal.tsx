import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPdf: () => void;
}

export default function SuccessModal({ isOpen, onClose, onDownloadPdf }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">
            제출 완료!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            설문지가 성공적으로 제출되었습니다.<br />
            담당 변호사가 검토 후 연락드리겠습니다.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={onDownloadPdf}
              className="w-full bg-navy-600 hover:bg-navy-700 text-white font-medium py-3 px-6"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF 다운로드
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
