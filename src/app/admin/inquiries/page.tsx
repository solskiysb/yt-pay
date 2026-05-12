import { MessageSquare, Mail, Clock } from "lucide-react";

type InquiryStatus = "new" | "read" | "replied" | "closed";

interface Inquiry {
  id: string;
  buyerName: string;
  buyerEmail: string;
  listing: string;
  listingId: string;
  message: string;
  date: string;
  status: InquiryStatus;
}

const inquiries: Inquiry[] = [
  {
    id: "inq-001",
    buyerName: "Pierre Dupont",
    buyerEmail: "pierre.dupont@free.fr",
    listing: "1973 Porsche 911 Carrera RS 2.7",
    listingId: "mod-001",
    message:
      "Is this car still available? I would like to arrange a viewing in Stuttgart next week. Can you also provide the full service history?",
    date: "2026-05-11",
    status: "new",
  },
  {
    id: "inq-002",
    buyerName: "Erik Johansson",
    buyerEmail: "erik.j@gmail.com",
    listing: "1961 Jaguar E-Type Series 1 Roadster",
    listingId: "mod-004",
    message:
      "Beautiful car. What is the history of the paintwork? Has it been resprayed? Also interested in shipping options to Sweden.",
    date: "2026-05-11",
    status: "new",
  },
  {
    id: "inq-003",
    buyerName: "Thomas Muller",
    buyerEmail: "t.muller@web.de",
    listing: "1987 Porsche 911 Turbo (930)",
    listingId: "mod-002",
    message:
      "Can you confirm the mileage? The listing says 61,400 km but the photos show a different odometer reading.",
    date: "2026-05-10",
    status: "read",
  },
  {
    id: "inq-004",
    buyerName: "Sophie Martin",
    buyerEmail: "sophie.m@proton.me",
    listing: "1967 Alfa Romeo Spider 1600 Duetto",
    listingId: "mod-003",
    message:
      "I am very interested. Is the price negotiable? I can collect from Italy.",
    date: "2026-05-10",
    status: "replied",
  },
  {
    id: "inq-005",
    buyerName: "Maria Garcia",
    buyerEmail: "maria.g@outlook.es",
    listing: "1989 Mercedes-Benz 300 SL",
    listingId: "mod-006",
    message:
      "Does this come with the hardtop as well? What is the condition of the soft top?",
    date: "2026-05-09",
    status: "replied",
  },
  {
    id: "inq-006",
    buyerName: "Pierre Dupont",
    buyerEmail: "pierre.dupont@free.fr",
    listing: "1955 Mercedes-Benz 300 SL Gullwing",
    listingId: "mod-007",
    message:
      "Serious buyer. Can we arrange a PPI with a specialist? Happy to cover the cost. Available any day next week.",
    date: "2026-05-09",
    status: "new",
  },
  {
    id: "inq-007",
    buyerName: "Erik Johansson",
    buyerEmail: "erik.j@gmail.com",
    listing: "1970 Datsun 240Z",
    listingId: "mod-008",
    message:
      "Is this an L24 engine or has it been swapped? Also, any rust issues?",
    date: "2026-05-08",
    status: "read",
  },
  {
    id: "inq-008",
    buyerName: "Thomas Muller",
    buyerEmail: "t.muller@web.de",
    listing: "1967 Alfa Romeo Spider 1600 Duetto",
    listingId: "mod-003",
    message: "Would you accept a trade plus cash? I have a 1971 Fiat 124 Spider.",
    date: "2026-05-08",
    status: "closed",
  },
  {
    id: "inq-009",
    buyerName: "Sophie Martin",
    buyerEmail: "sophie.m@proton.me",
    listing: "1985 Toyota AE86 Sprinter Trueno",
    listingId: "mod-009",
    message:
      "Is this the zenki or kouki version? Does it have the original 4A-GE engine?",
    date: "2026-05-07",
    status: "new",
  },
  {
    id: "inq-010",
    buyerName: "Maria Garcia",
    buyerEmail: "maria.g@outlook.es",
    listing: "1973 Porsche 911 Carrera RS 2.7",
    listingId: "mod-001",
    message:
      "Can you provide the Porsche Certificate of Authenticity number? I want to verify with Porsche before making an offer.",
    date: "2026-05-07",
    status: "read",
  },
];

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-amber-100 text-amber-700",
  replied: "bg-green-100 text-green-700",
  closed: "bg-stone-100 text-stone-500",
};

export default function InquiriesPage() {
  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Inquiries</h2>
          <p className="text-sm text-stone-500">
            {inquiries.length} total &middot; {newCount} new
          </p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
            <Mail className="h-4 w-4" />
            {newCount} unread
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Listing</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-stone-900">{inq.buyerName}</p>
                  <p className="text-xs text-stone-400">{inq.buyerEmail}</p>
                </td>
                <td className="px-4 py-2.5">
                  <p className="text-stone-700">{inq.listing}</p>
                  <p className="font-mono text-xs text-stone-400">
                    {inq.listingId}
                  </p>
                </td>
                <td className="max-w-sm px-4 py-2.5">
                  <p className="truncate text-stone-600">{inq.message}</p>
                </td>
                <td className="px-4 py-2.5 text-stone-500">{inq.date}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[inq.status]}`}
                  >
                    {inq.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
