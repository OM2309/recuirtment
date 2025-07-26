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
