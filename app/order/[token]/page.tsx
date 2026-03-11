import MemberFormItems from "@/components/members/memberFormItems";
import { getMemberFormItemsFromToken } from "@/lib/actions/members";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function OrderPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  const member = await prisma.member.findUnique({
    where: { orderToken: token },
    include: {
      club: true,
      orders: true,
    },
  });

  if (!member) {
    return notFound();
  }

  if (member.orders.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Bestelling al geplaatst
          </h1>
          <p className="text-gray-600">
            Je hebt al een bestelling geplaatst. Neem contact op met je club als
            je wijzigingen wilt maken.
          </p>
        </div>
      </div>
    );
  }

  const form = await getMemberFormItemsFromToken(token);

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Geen formulier gevonden
          </h1>
          <p className="text-gray-600">
            Er is momenteel geen bestelformulier beschikbaar voor jouw groep.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          {member.club.logoUrl && (
            <Image
              src={member.club.logoUrl}
              alt={member.club.name}
              width={80}
              height={80}
              className="mx-auto mb-4 object-contain"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-800">
            {member.club.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Welkom {member.firstName} {member.lastName}! Plaats hieronder je
            bestelling.
          </p>
        </div>

        <MemberFormItems form={form} token={token} />
      </div>
    </div>
  );
}