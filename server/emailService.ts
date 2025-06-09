import sgMail from '@sendgrid/mail';
import { QuestionnaireFormData } from '@shared/schema';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not found in environment variables');
}

export async function sendQuestionnaireEmail(
  formData: QuestionnaireFormData,
  pdfBuffer: Buffer
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const currentDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const msg = {
      to: 'computerschool100@gmail.com',
      from: 'noreply@your-domain.com', // This should be a verified sender
      subject: `새로운 이혼 상담 사전 설문지 제출 - ${formData.name}`,
      html: generateEmailHTML(formData, currentDate),
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: `이혼상담_사전설문지_${formData.name}_${new Date().toISOString().split('T')[0]}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };

    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

function generateEmailHTML(data: QuestionnaireFormData, submissionDate: string): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>새로운 이혼 상담 사전 설문지</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .section {
          background: #f8fafc;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          border-left: 4px solid #1e3a8a;
        }
        .section-title {
          color: #1e3a8a;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .field {
          margin-bottom: 10px;
        }
        .field-label {
          font-weight: bold;
          color: #4b5563;
        }
        .field-value {
          margin-left: 10px;
          color: #1f2937;
        }
        .highlight {
          background: #fef3c7;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #f59e0b;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>새로운 이혼 상담 사전 설문지</h1>
        <p>제출일: ${submissionDate}</p>
      </div>

      <div class="highlight">
        <strong>클라이언트 기본 정보</strong><br>
        이름: ${data.name}<br>
        연락처: ${data.phone}<br>
        이메일: ${data.email}
      </div>

      <div class="section">
        <div class="section-title">1. 기본정보</div>
        <div class="field">
          <span class="field-label">이름:</span>
          <span class="field-value">${data.name || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">생년월일:</span>
          <span class="field-value">${data.birthDate || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">성별:</span>
          <span class="field-value">${data.gender || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">연락처:</span>
          <span class="field-value">${data.phone || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">이메일:</span>
          <span class="field-value">${data.email || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">현재 거주지:</span>
          <span class="field-value">${data.address || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">배우자 이름:</span>
          <span class="field-value">${data.spouseName || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">배우자 생년월일:</span>
          <span class="field-value">${data.spouseBirthDate || ''}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">2. 혼인 정보</div>
        <div class="field">
          <span class="field-label">혼인신고 여부:</span>
          <span class="field-value">${data.marriageType || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">결혼 날짜:</span>
          <span class="field-value">${data.marriageDate || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">혼인 기간:</span>
          <span class="field-value">${data.marriageDuration || ''}</span>
        </div>
        <div class="field">
          <span class="field-label">자녀 유무:</span>
          <span class="field-value">${data.hasChildren || ''}</span>
        </div>
        ${data.childrenDetails ? `
        <div class="field">
          <span class="field-label">자녀 정보:</span>
          <span class="field-value">${data.childrenDetails}</span>
        </div>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">3. 이혼 사유</div>
        <div class="field">
          <span class="field-label">선택된 사유:</span>
          <span class="field-value">${Array.isArray(data.divorceReasons) ? data.divorceReasons.join(', ') : ''}</span>
        </div>
        ${data.otherReasons ? `
        <div class="field">
          <span class="field-label">기타 사유:</span>
          <span class="field-value">${data.otherReasons}</span>
        </div>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">4. 별거 여부</div>
        <div class="field">
          <span class="field-label">현재 별거 중:</span>
          <span class="field-value">${data.separated || ''}</span>
        </div>
        ${data.separationStartDate ? `
        <div class="field">
          <span class="field-label">별거 시작일:</span>
          <span class="field-value">${data.separationStartDate}</span>
        </div>
        ` : ''}
        ${data.separationReason ? `
        <div class="field">
          <span class="field-label">별거 원인:</span>
          <span class="field-value">${data.separationReason}</span>
        </div>
        ` : ''}
      </div>

      ${data.consultationGoals || data.concerns ? `
      <div class="section">
        <div class="section-title">상담 목적 및 기대사항</div>
        ${data.consultationGoals ? `
        <div class="field">
          <span class="field-label">상담 목표:</span>
          <span class="field-value">${data.consultationGoals}</span>
        </div>
        ` : ''}
        ${data.concerns ? `
        <div class="field">
          <span class="field-label">걱정되는 부분:</span>
          <span class="field-value">${data.concerns}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <div class="highlight">
        <strong>참고사항:</strong><br>
        • 상세한 설문 내용은 첨부된 PDF 파일을 확인해주세요.<br>
        • 클라이언트 연락처: ${data.phone}<br>
        • 클라이언트 이메일: ${data.email}
      </div>
    </body>
    </html>
  `;
}