import React from "react";

export default function CvEditLayout({
  form,
  preview,
}: { form: React.ReactNode; preview: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4">
      {/* lock the viewport area; adjust 4rem if your navbar is a different height */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-4rem)] min-h-0 overflow-hidden">
        {/* LEFT: wider and the only scroller */}
        <aside
          className="
            col-span-12 lg:col-span-8 xl:col-span-7 2xl:col-span-6
            min-h-0 overflow-y-auto overscroll-contain
            bg-white rounded-xl border border-gray-200 p-4
          "
          aria-label="CV form"
        >
          {/* ensure children can scroll */}
          <div className="min-h-0 pb-8">{form}</div>
        </aside>

        {/* RIGHT: stays put; no scroll */}
        <section className="col-span-12 lg:col-span-5 xl:col-span-6" aria-label="CV preview">
          <div className="sticky top-20">
            <div className="rounded-xl border border-gray-200 bg-white">
              {preview}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}