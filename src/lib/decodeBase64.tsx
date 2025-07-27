export default function decodeBase64(encoded: string): string {
  try {
    return Buffer.from(encoded, "base64").toString("utf-8");
  } catch (error) {
    console.error("Error decoding base64 content:", error);
    return "";
  }
}
