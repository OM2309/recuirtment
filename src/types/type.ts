export interface OtpData {
  id: number;
  userId: number;
  otp: string;
}

export interface GmailMessagePart {
  filename?: string;
  mimeType?: string;
  body: {
    attachmentId?: string;
  };
}

export interface EmailItem {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  senderProfile: {
    name: string;
    email: string;
  };
}
export interface EmailListProps {
  contacts: EmailItem[];
}
