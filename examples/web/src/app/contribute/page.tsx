import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute — Open Helplines',
  description: 'How to contribute helpline data to the Open Helplines project.',
};

export default function ContributePage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Contribute Data</h1>
      <p className="text-gray-500 mb-8">
        Help us build the most comprehensive open directory of crisis support resources.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-seq-blue-400">How to add a helpline</h2>
        <ol className="list-decimal list-inside text-gray-400 space-y-3">
          <li>
            Fork the repository on{' '}
            <a
              href="https://github.com/Kouki-odaka/open-helplines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-seq-blue-400 hover:underline"
            >
              GitHub
            </a>
          </li>
          <li>
            Find or create the file at{' '}
            <code className="text-seq-blue-300 bg-gray-900 px-1.5 py-0.5 rounded text-sm">
              data/countries/[country-code]/helplines.json
            </code>
          </li>
          <li>
            Add your helpline using the JSON schema format (see example below)
          </li>
          <li>Open a pull request — we review and merge quickly</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-seq-blue-400">JSON Format</h2>
        <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
          <code>{`{
  "$schema": "../../../schemas/helpline.schema.json",
  "country": "XX",
  "records": [
    {
      "id": "xx-helpline-name",
      "country": "XX",
      "name": "Crisis Helpline Name",
      "category": "suicide_prevention",
      "contacts": [
        {
          "method": "phone",
          "number": "+1-800-xxx-xxxx",
          "languages": ["en"],
          "hours": "24/7",
          "free": true,
          "anonymous": true
        }
      ],
      "description": "Brief description of the service.",
      "website": "https://example.org",
      "verified_at": "2026-06-02",
      "source": "https://example.org",
      "government_backed": false
    }
  ]
}`}</code>
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-seq-blue-400">Guidelines</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>One helpline per record (no aggregated listings)</li>
          <li>Verify phone numbers and URLs before submitting</li>
          <li>Include accurate operating hours (24/7 or specific times)</li>
          <li>Use ISO 3166-1 alpha-2 country codes (e.g., &quot;JP&quot;, &quot;US&quot;)</li>
          <li>Use BCP 47 language codes (e.g., &quot;en&quot;, &quot;ja&quot;, &quot;es&quot;)</li>
          <li>Data must be factual and verifiable — no promotional content</li>
        </ul>
      </section>

      <div className="flex gap-3">
        <a
          href="https://github.com/Kouki-odaka/open-helplines/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-seq-blue-600 hover:bg-seq-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Full Contributing Guide →
        </a>
        <a
          href="https://github.com/Kouki-odaka/open-helplines/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Open an Issue
        </a>
      </div>
    </article>
  );
}
