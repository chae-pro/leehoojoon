import { QuestionnaireFormData } from "@shared/schema";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generatePDF(data: QuestionnaireFormData): Promise<Blob> {
  // Create a temporary HTML element with Korean-friendly styling
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '210mm';
  tempDiv.style.padding = '20mm';
  tempDiv.style.fontFamily = "'Noto Sans KR', sans-serif";
  tempDiv.style.fontSize = '12px';
  tempDiv.style.lineHeight = '1.6';
  tempDiv.style.color = '#000';
  tempDiv.style.backgroundColor = '#fff';
  
  // Generate HTML content with proper Korean text
  tempDiv.innerHTML = generateHTMLContent(data);
  
  // Add to document temporarily
  document.body.appendChild(tempDiv);
  
  try {
    // Convert HTML to canvas with high quality
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: tempDiv.scrollWidth,
      height: tempDiv.scrollHeight
    });
    
    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    return pdf.output('blob');
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
}

function generateHTMLContent(data: QuestionnaireFormData): string {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <div style="max-width: 100%; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 10px 0; color: #1e3a8a;">이혼 상담 사전 설문지</h1>
        <p style="margin: 0; color: #666;">작성일: ${currentDate}</p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">1. 기본정보</h2>
        <div style="line-height: 1.8;">
          <p><strong>이름:</strong> ${data.name || ''}</p>
          <p><strong>생년월일:</strong> ${data.birthDate || ''}</p>
          <p><strong>성별:</strong> ${data.gender || ''}</p>
          <p><strong>연락처:</strong> ${data.phone || ''}</p>
          <p><strong>이메일:</strong> ${data.email || ''}</p>
          <p><strong>현재 거주지 주소:</strong> ${data.address || ''}</p>
          <p><strong>배우자 이름:</strong> ${data.spouseName || ''}</p>
          <p><strong>배우자 생년월일:</strong> ${data.spouseBirthDate || ''}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">2. 혼인 정보</h2>
        <div style="line-height: 1.8;">
          <p><strong>혼인신고 여부:</strong> ${data.marriageType || ''}</p>
          <p><strong>결혼 날짜:</strong> ${data.marriageDate || ''}</p>
          <p><strong>혼인 기간:</strong> ${data.marriageDuration || ''}</p>
          <p><strong>자녀 유무:</strong> ${data.hasChildren || ''}</p>
          ${data.childrenDetails ? `<p><strong>자녀 정보:</strong> ${data.childrenDetails}</p>` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">3. 이혼 사유</h2>
        <div style="line-height: 1.8;">
          <p><strong>선택된 사유:</strong> ${Array.isArray(data.divorceReasons) ? data.divorceReasons.join(', ') : ''}</p>
          ${data.otherReasons ? `<p><strong>기타 사유:</strong> ${data.otherReasons}</p>` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">4. 별거 여부</h2>
        <div style="line-height: 1.8;">
          <p><strong>현재 별거 중:</strong> ${data.separated || ''}</p>
          ${data.separationStartDate ? `<p><strong>별거 시작일:</strong> ${data.separationStartDate}</p>` : ''}
          ${data.separationReason ? `<p><strong>별거 원인:</strong> ${data.separationReason}</p>` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">5. 재산 정보</h2>
        <div style="line-height: 1.8;">
          <p><strong>보유 자산:</strong> ${Array.isArray(data.assets) ? data.assets.join(', ') : ''}</p>
          ${data.otherAssets ? `<p><strong>기타 자산:</strong> ${data.otherAssets}</p>` : ''}
          <p><strong>재산 합의 여부:</strong> ${data.assetAgreement || ''}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">6. 부채 정보</h2>
        <div style="line-height: 1.8;">
          <p><strong>부채 총액:</strong> ${data.totalDebt || ''}</p>
          <p><strong>부채 명의:</strong> ${data.debtHolder || ''}</p>
          <p><strong>상대방 인지 여부:</strong> ${data.spouseAwareness || ''}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">7. 양육 관련</h2>
        <div style="line-height: 1.8;">
          <p><strong>주양육권 희망:</strong> ${data.custodyWish || ''}</p>
          <p><strong>양육비 청구 예정:</strong> ${data.alimonyPlan || ''}</p>
          <p><strong>상대방의 양육 관여:</strong> ${Array.isArray(data.spouseInvolvement) ? data.spouseInvolvement.join(', ') : ''}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">8. 과거 법적 절차 여부</h2>
        <div style="line-height: 1.8;">
          <p><strong>과거 법적 절차:</strong> ${Array.isArray(data.pastLegalProcedures) ? data.pastLegalProcedures.join(', ') : ''}</p>
          ${data.otherLegalProcedures ? `<p><strong>기타 법적 절차:</strong> ${data.otherLegalProcedures}</p>` : ''}
          ${data.ongoingLegalProcedures ? `<p><strong>현재 진행 중인 절차:</strong> ${data.ongoingLegalProcedures}</p>` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">9. 상담 목적 및 기대사항</h2>
        <div style="line-height: 1.8;">
          ${data.consultationGoals ? `<p><strong>상담 목표:</strong> ${data.consultationGoals}</p>` : ''}
          ${data.concerns ? `<p><strong>걱정되는 부분:</strong> ${data.concerns}</p>` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 5px;">10. 개인정보 처리 동의</h2>
        <div style="line-height: 1.8;">
          <p><strong>개인정보 처리 동의:</strong> ${data.privacyConsent ? '동의함' : '동의하지 않음'}</p>
          <p><strong>이메일 전송 동의:</strong> ${data.emailConsent ? '동의함' : '동의하지 않음'}</p>
        </div>
      </div>
    </div>
  `;
}