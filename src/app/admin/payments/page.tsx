import { CreditCard } from "lucide-react";

type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

interface Payment {
  id: string;
  seller: string;
  listing: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  method: string;
}

const payments: Payment[] = [
  {
    id: "PAY-20260511-001",
    seller: "Klassik Automobil Stuttgart",
    listing: "1973 Porsche 911 Carrera RS 2.7",
    amount: 39,
    status: "paid",
    date: "2026-05-11",
    method: "Stripe",
  },
  {
    id: "PAY-20260510-002",
    seller: "Prestige Motors AG",
    listing: "1987 Porsche 911 Turbo (930)",
    amount: 149,
    status: "paid",
    date: "2026-05-10",
    method: "Stripe",
  },
  {
    id: "PAY-20260510-003",
    seller: "Rosso Corsa Classics",
    listing: "1967 Alfa Romeo Spider 1600 Duetto",
    amount: 39,
    status: "paid",
    date: "2026-05-10",
    method: "Stripe",
  },
  {
    id: "PAY-20260509-004",
    seller: "British Heritage Motors",
    listing: "1961 Jaguar E-Type Series 1",
    amount: 149,
    status: "paid",
    date: "2026-05-09",
    method: "Stripe",
  },
  {
    id: "PAY-20260509-005",
    seller: "Quick Flip Motors",
    listing: "2019 BMW M3 Competition",
    amount: 39,
    status: "refunded",
    date: "2026-05-09",
    method: "Stripe",
  },
  {
    id: "PAY-20260508-006",
    seller: "Hamburg Classics GmbH",
    listing: "1989 Mercedes-Benz 300 SL",
    amount: 39,
    status: "paid",
    date: "2026-05-08",
    method: "Stripe",
  },
  {
    id: "PAY-20260508-007",
    seller: "Concours Collection",
    listing: "1955 Mercedes-Benz 300 SL Gullwing",
    amount: 399,
    status: "paid",
    date: "2026-05-08",
    method: "Stripe",
  },
  {
    id: "PAY-20260507-008",
    seller: "JDM Legends EU",
    listing: "1970 Datsun 240Z",
    amount: 39,
    status: "pending",
    date: "2026-05-07",
    method: "Stripe",
  },
  {
    id: "PAY-20260507-009",
    seller: "Drift Heritage",
    listing: "1985 Toyota AE86 Sprinter Trueno",
    amount: 39,
    status: "failed",
    date: "2026-05-07",
    method: "Stripe",
  },
  {
    id: "PAY-20260506-010",
    seller: "Classic Garage Wien",
    listing: "1972 BMW 2002 tii",
    amount: 39,
    status: "paid",
    date: "2026-05-06",
    method: "Stripe",
  },
  {
    id: "PAY-20260505-011",
    seller: "Scandinavian Classics AB",
    listing: "1967 Volvo P1800S",
    amount: 149,
    status: "paid",
    date: "2026-05-05",
    method: "Stripe",
  },
  {
    id: "PAY-20260504-012",
    seller: "Retroautos Madrid",
    listing: "1969 SEAT 600",
    amount: 19,
    status: "paid",
    date: "2026-05-04",
    method: "Stripe",
  },
  {
    id: "PAY-20260503-013",
    seller: "Anna Schneider",
    listing: "1965 Porsche 356 SC",
    amount: 39,
    status: "paid",
    date: "2026-05-03",
    method: "Stripe",
  },
];

const statusStyles: Record<PaymentStatus, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default function PaymentsPage() {
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Payments</h2>
          <p className="text-sm text-stone-500">
            {payments.length} transactions &middot; &euro;{totalRevenue} total
            revenue
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2">
          <CreditCard className="h-4 w-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            &euro;{totalRevenue}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Listing</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5 font-mono text-xs text-stone-500">
                  {p.id}
                </td>
                <td className="px-4 py-2.5 text-stone-700">{p.seller}</td>
                <td className="max-w-48 truncate px-4 py-2.5 text-stone-700">
                  {p.listing}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-stone-900">
                  &euro;{p.amount}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[p.status]}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-stone-500">{p.date}</td>
                <td className="px-4 py-2.5 text-stone-400">{p.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
