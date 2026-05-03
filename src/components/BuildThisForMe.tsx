"use client";

interface BuildThisForMeProps {
  category?: string;
  websiteUrl?: string;
}

export default function BuildThisForMe({ category, websiteUrl }: BuildThisForMeProps) {
  const subject = encodeURIComponent(
    `IntelliScan AI - Build Request${category ? `: ${category}` : ""}`
  );
  const body = encodeURIComponent(
    `Hi NOFA AI Factory team,\n\nI scanned my website${websiteUrl ? ` (${websiteUrl})` : ""} with IntelliScan AI™ and I'm interested in getting a custom AI solution built${category ? ` for: ${category}` : ""}.\n\nPlease reach out to discuss next steps.\n\nThank you!`
  );

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
          href={`mailto:contact@nofabc.com?subject=${subject}&body=${body}`}
          className="bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors whitespace-nowrap"
        >
          Build This for Me →
        </a>
      </div>
    </div>
  );
}
