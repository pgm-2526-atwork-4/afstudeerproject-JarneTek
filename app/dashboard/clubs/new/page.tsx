import NewClubForm from "@/components/clubs/NewClubForm";
 
export default function NewClubPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Club</h1>
      <p className="text-gray-600 mb-8">
        Set up your club branding and details.
      </p>
      <NewClubForm />
    </div>
  );
}
