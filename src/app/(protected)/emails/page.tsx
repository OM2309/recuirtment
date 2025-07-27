import { fetchApplicationResumes } from "@/actions";
import EmailList from "@/components/email-list";

export default async function Emails() {
  const fetchEmails = await fetchApplicationResumes();

  return (
    <div className="bg-background p-4">
      <EmailList contacts={fetchEmails} />
    </div>
  );
}
