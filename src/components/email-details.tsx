import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { EmailItem } from "@/types/type";
import sanitizeHtml from "sanitize-html";

interface EmailDetailsProps {
  selectedEmail: EmailItem | null;
}

export default function EmailDetails({ selectedEmail }: EmailDetailsProps) {
  // Sanitize email body to remove unsafe HTML and keep allowed tags
  const sanitizedBody = selectedEmail?.body
    ? sanitizeHtml(selectedEmail.body, {
        allowedTags: ["p", "br", "a", "b", "i", "ul", "li", "h3", "h4"],
        allowedAttributes: {
          a: ["href", "target"],
        },
        transformTags: {
          a: (tagName, attribs) => ({
            tagName,
            attribs: {
              ...attribs,
              target: "_blank",
              rel: "noopener noreferrer",
            },
          }),
        },
      })
    : "";

  return (
    <div className="flex-1 max-w-3xl h-[calc(100vh-8rem)]">
      {selectedEmail ? (
        <Card className="border-0 shadow-sm bg-white dark:bg-[#1f1f1f] h-full flex flex-col">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {selectedEmail.subject}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              From: {selectedEmail.senderProfile.name} &lt;
              {selectedEmail.senderProfile.email}&gt;
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              CC: {selectedEmail.cc}
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 text-sm text-gray-700 dark:text-gray-200 prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-[#272727] rounded-lg p-6 shadow-sm">
          <Mail className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            No Email Selected
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Select an email from the list to view its details.
          </p>
        </div>
      )}
    </div>
  );
}
