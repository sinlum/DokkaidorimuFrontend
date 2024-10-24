import WriterProfilePage from "@/app/_components/WriterProfile";

export default function WriterProfile({ params }) {
  console.log("params", params);
  return <WriterProfilePage authorId={params.id} />;
}
