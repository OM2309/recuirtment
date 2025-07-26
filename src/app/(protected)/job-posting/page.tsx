import { fetchApplicationResumes } from "@/actions";

export default async function JobPosting() {
  const resumes = await fetchApplicationResumes();
  console.log("Resume", resumes);
  return (
    <div>
      <div></div>
    </div>
  );
}
