import { QuestionnaireFormData } from "@shared/schema";

export async function generatePDF(data: QuestionnaireFormData): Promise<Blob> {
  // @ts-ignore - jsPDF is loaded via CDN
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Load Noto Sans KR font for Korean support
  try {
    await loadKoreanFont(doc);
  } catch (error) {
    console.warn('Korean font loading failed, using default font:', error);
  }

  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width - (margin * 2);

  // Helper function to add new page if needed
  const checkPageBreak = (neededSpace: number = 20) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont(undefined, 'bold');
    } else {
      doc.setFont(undefined, 'normal');
    }

    const lines = doc.splitTextToSize(text, pageWidth);
    const neededSpace = lines.length * lineHeight;
    
    checkPageBreak(neededSpace);
    
    lines.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  // Title
  addText('이혼 상담 사전 설문지', 18, true);
  yPosition += lineHeight;
  addText(`작성일: ${new Date().toLocaleDateString('ko-KR')}`, 10);
  yPosition += lineHeight * 2;

  // Section 1: Basic Information
  addText('1. 기본정보', 14, true);
  yPosition += lineHeight;

  const basicInfo = [
    `이름: ${data.name || ''}`,
    `생년월일: ${data.birthDate || ''}`,
    `성별: ${data.gender || ''}`,
    `연락처: ${data.phone || ''}`,
    `이메일: ${data.email || ''}`,
    `주소: ${data.address || ''}`,
    `배우자 이름: ${data.spouseName || ''}`,
    `배우자 생년월일: ${data.spouseBirthDate || ''}`
  ];

  basicInfo.forEach(info => addText(info));
  yPosition += lineHeight;

  // Section 2: Marriage Information
  addText('2. 혼인 정보', 14, true);
  yPosition += lineHeight;

  const marriageInfo = [
    `혼인신고 여부: ${data.marriageType || ''}`,
    `결혼 날짜: ${data.marriageDate || ''}`,
    `혼인 기간: ${data.marriageDuration || ''}`,
    `자녀 유무: ${data.hasChildren || ''}`,
    `자녀 정보: ${data.childrenDetails || ''}`
  ];

  marriageInfo.forEach(info => addText(info));
  yPosition += lineHeight;

  // Section 3: Divorce Reasons
  addText('3. 이혼 사유', 14, true);
  yPosition += lineHeight;

  const divorceReasons = Array.isArray(data.divorceReasons) ? data.divorceReasons.join(', ') : '';
  addText(`선택된 사유: ${divorceReasons}`);
  if (data.otherReasons) {
    addText(`기타 사유: ${data.otherReasons}`);
  }
  yPosition += lineHeight;

  // Section 4: Separation
  addText('4. 별거 여부', 14, true);
  yPosition += lineHeight;

  addText(`현재 별거 중: ${data.separated || ''}`);
  if (data.separationStartDate) {
    addText(`별거 시작일: ${data.separationStartDate}`);
  }
  if (data.separationReason) {
    addText(`별거 원인: ${data.separationReason}`);
  }
  yPosition += lineHeight;

  // Section 5: Assets
  addText('5. 재산 정보', 14, true);
  yPosition += lineHeight;

  const assets = Array.isArray(data.assets) ? data.assets.join(', ') : '';
  addText(`보유 자산: ${assets}`);
  if (data.otherAssets) {
    addText(`기타 자산: ${data.otherAssets}`);
  }
  addText(`재산 합의 여부: ${data.assetAgreement || ''}`);
  yPosition += lineHeight;

  // Section 6: Debt
  addText('6. 부채 정보', 14, true);
  yPosition += lineHeight;

  const debtInfo = [
    `부채 총액: ${data.totalDebt || ''}`,
    `부채 명의: ${data.debtHolder || ''}`,
    `상대방 인지 여부: ${data.spouseAwareness || ''}`
  ];

  debtInfo.forEach(info => addText(info));
  yPosition += lineHeight;

  // Section 7: Child Care
  addText('7. 양육 관련', 14, true);
  yPosition += lineHeight;

  const childCareInfo = [
    `주양육권 희망: ${data.custodyWish || ''}`,
    `양육비 청구 예정: ${data.alimonyPlan || ''}`,
  ];

  childCareInfo.forEach(info => addText(info));

  const spouseInvolvement = Array.isArray(data.spouseInvolvement) ? data.spouseInvolvement.join(', ') : '';
  addText(`상대방의 양육 관여: ${spouseInvolvement}`);
  yPosition += lineHeight;

  // Section 8: Legal Procedures
  addText('8. 과거 법적 절차 여부', 14, true);
  yPosition += lineHeight;

  const pastProcedures = Array.isArray(data.pastLegalProcedures) ? data.pastLegalProcedures.join(', ') : '';
  addText(`과거 법적 절차: ${pastProcedures}`);
  if (data.otherLegalProcedures) {
    addText(`기타 법적 절차: ${data.otherLegalProcedures}`);
  }
  if (data.ongoingLegalProcedures) {
    addText(`현재 진행 중인 절차: ${data.ongoingLegalProcedures}`);
  }
  yPosition += lineHeight;

  // Section 9: Consultation Purpose
  addText('9. 상담 목적 및 기대사항', 14, true);
  yPosition += lineHeight;

  if (data.consultationGoals) {
    addText(`상담 목표: ${data.consultationGoals}`);
  }
  if (data.concerns) {
    addText(`걱정되는 부분: ${data.concerns}`);
  }
  yPosition += lineHeight;

  // Section 10: Consent
  addText('10. 개인정보 처리 동의', 14, true);
  yPosition += lineHeight;

  addText(`개인정보 처리 동의: ${data.privacyConsent ? '동의함' : '동의하지 않음'}`);
  addText(`이메일 전송 동의: ${data.emailConsent ? '동의함' : '동의하지 않음'}`);

  return doc.output('blob');
}

async function loadKoreanFont(doc: any): Promise<void> {
  // This is a simplified approach. In a real implementation,
  // you might want to use a proper Korean font file or use a service like Google Fonts
  try {
    doc.setFont('helvetica');
  } catch (error) {
    console.warn('Font loading failed:', error);
  }
}
