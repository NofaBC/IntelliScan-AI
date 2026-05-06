"use client";

interface BuildThisForMeProps {
  category?: string;
  websiteUrl?: string;
}

export default function BuildThisForMe({ category, websiteUrl }: BuildThisForMeProps) {
  const calendlyUrl = "https://calendly.com/farhad-nofa/30min";

  return (
    <div className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-xl p-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Want this built for you?</h3>
          <p className="text-brand-100 text-sm mt-1">
            NOFA AI Factory™ can implement this solution end-to-end.
          </p>
        </div>
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors whitespace-nowrap"
        >
          Build This for Me →
        </a>
      </div>
    </div>
  );
}
