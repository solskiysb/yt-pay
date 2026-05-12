import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-6xl font-bold text-stone-900">404</h1>
      <p className="mt-4 text-lg text-stone-600">This car has left the garage.</p>
      <p className="mt-2 text-stone-500">The page you are looking for does not exist or has been moved.</p>
      <Link href="/cars" className="mt-8 inline-flex h-11 items-center rounded-full bg-amber-500 px-6 font-medium text-stone-900 hover:bg-amber-400">
        Browse Collection
      </Link>
    </div>
  );
}
