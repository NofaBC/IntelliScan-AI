"use client";

import { ScanReport } from "@/types";
import BuildThisForMe from "./BuildThisForMe";

interface ReportViewProps {
  report: ScanReport;
  onExportPdf?: () => void;
  canExportPdf?: boolean;
}

export default function ReportView({ report, onExportPdf, canExportPdf = true }: ReportViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Opportunity Report</h2>
            <p className="text-gray-500 text-sm mt-1">
              {report.url} &middot; Scanned {new Date(report.scanDate).toLocaleDateString()}
            </p>
          </div>
          {canExportPdf && onExportPdf && (
            <button onClick={onExportPdf} className="btn-secondary text-sm !py-2 !px-4">
              Export PDF
            </button>
          )}
        </div>
      </div>

      {/* Industry & Snapshot */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Detected Industry
            </h3>
            <p className="text-lg font-medium mt-1">{report.industry}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Business Snapshot
            </h3>
            <p className="text-gray-700 mt-1">{report.businessSnapshot}</p>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="card">
        <h3 className="text-lg font-semibold text-green-700 mb-3">Strengths</h3>
        <ul className="space-y-2">
          {report.strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Automations */}
      <div className="card">
        <h3 className="text-lg font-semibold text-amber-700 mb-3">Missing Automations</h3>
        <ul className="space-y-2">
          {report.missingAutomations.map((m, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">!</span>
              <span className="text-gray-700">{m}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recommended Solutions</h3>
        {report.recommendations.map((rec, i) => (
          <div key={i} className="card">
            <h4 className="text-brand-500 font-bold text-lg">{rec.category}</h4>
            <p className="text-gray-700 mt-2">{rec.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-500">DIY Tools</h5>
                <ul className="mt-1 space-y-1">
                  {rec.diyTools.map((t, j) => (
                    <li key={j} className="text-sm text-gray-600">• {t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-500">Third-Party Options</h5>
                <ul className="mt-1 space-y-1">
                  {rec.thirdPartyTools.map((t, j) => (
                    <li key={j} className="text-sm text-gray-600">• {t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-500">Custom Build</h5>
                <p className="text-sm text-gray-600 mt-1">{rec.nofaOption}</p>
              </div>
            </div>

            <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-500">Est. Time Saved</span>
                <p className="text-sm font-semibold text-brand-500">{rec.estimatedTimeSaved}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Est. Revenue Impact</span>
                <p className="text-sm font-semibold text-green-600">{rec.estimatedRevenueImpact}</p>
              </div>
            </div>

            <div className="mt-4">
              <BuildThisForMe category={rec.category} websiteUrl={report.url} />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card bg-brand-50 border-brand-200">
        <h3 className="text-lg font-semibold text-brand-700 mb-4">Overall Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-sm text-brand-600">Total Estimated Time Saved</span>
            <p className="text-2xl font-bold text-brand-700">{report.overallTimeSaved}</p>
          </div>
          <div>
            <span className="text-sm text-brand-600">Revenue Opportunity</span>
            <p className="text-2xl font-bold text-green-700">{report.overallRevenueOpportunity}</p>
          </div>
          <div>
            <span className="text-sm text-brand-600">Next Recommended Action</span>
            <p className="text-sm font-medium text-gray-800 mt-1">{report.nextRecommendedAction}</p>
          </div>
        </div>
      </div>

      {/* Global CTA */}
      <BuildThisForMe websiteUrl={report.url} />
    </div>
  );
}
