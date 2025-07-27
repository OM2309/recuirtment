import decodeBase64 from "./decodeBase64";

function extractEmailBody(payload: any): string {
  let body = "";

  // Check if the email has parts (multipart)
  if (payload.parts) {
    // Iterate through parts to find text/plain or text/html
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        body = decodeBase64(part.body.data);
        break;
      } else if (part.mimeType === "text/html" && part.body?.data) {
        body = decodeBase64(part.body.data);
      }
    }
  } else if (payload.body?.data) {
    body = decodeBase64(payload.body.data);
  }

  return body || "No body content available";
}

export default extractEmailBody;
