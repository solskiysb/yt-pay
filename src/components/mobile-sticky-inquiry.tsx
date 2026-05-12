"use client";

import { MessageCircle } from "lucide-react";

interface MobileStickyInquiryProps {
  price: string;
}

export function MobileStickyInquiry({ price }: MobileStickyInquiryProps) {
  function scrollToForm() {
    const el = document.getElementById("inquiry-form-mobile");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-stone-900">{price}</p>
        </div>
        <button
          onClick={scrollToForm}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-400 active:bg-amber-600"
        >
          <MessageCircle className="size-4" />
          Inquire Now
        </button>
      </div>
    </div>
  );
}
