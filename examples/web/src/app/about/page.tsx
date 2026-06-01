import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — Open Helplines',
  description: 'Learn about the Open Helplines project, its data, and how to contribute.',
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">About Open Helplines</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-brand-light">What is this?</h2>
        <p className="text-neutral-muted leading-relaxed mb-4">
          Open Helplines is a free, open-source dataset of mental health and crisis support
          helplines from around the world. The data is structured, machine-readable, and released
          under the{' '}
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-light hover:underline"
          >
            CC0 1.0 Universal
          </a>{' '}
          (Public Domain) license — meaning you can use it for any purpose, including commercial,
          without attribution.
        </p>
        <p className="text-neutral-muted leading-relaxed">
          This visualization site helps explore the coverage and characteristics of global crisis
          support resources.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-brand-light">The Data</h2>
        <ul className="list-disc list-inside text-neutral-muted space-y-2">
          <li>Each helpline includes phone/text/chat contacts, languages, and operating hours</li>
          <li>Categories: suicide prevention, mental health, crisis, domestic violence, LGBTQ+, and more</li>
          <li>Data is verified periodically and community-maintained</li>
          <li>Available in JSON format, compatible with the open-helplines npm package</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-brand-light">Visualizations</h2>
        <div className="space-y-4">
          <div className="bg-neutral-surface border border-neutral-border rounded-lg p-4">
            <h3 className="font-medium mb-1">
              <Link href="/" className="text-brand-light hover:underline">
                🌍 Globe View
              </Link>
            </h3>
            <p className="text-sm text-neutral-muted">
              Interactive 3D globe showing helpline coverage by country. Hover for counts,
              click for details.
            </p>
          </div>
          <div className="bg-neutral-surface border border-neutral-border rounded-lg p-4">
            <h3 className="font-medium mb-1">
              <Link href="/network" className="text-brand-light hover:underline">
                🕸️ Network View
              </Link>
            </h3>
            <p className="text-sm text-neutral-muted">
              Force-directed graph showing relationships between helplines, categories,
              languages, and contact methods.
            </p>
          </div>
          <div className="bg-neutral-surface border border-neutral-border rounded-lg p-4">
            <h3 className="font-medium mb-1">
              <Link href="/heatmap" className="text-brand-light hover:underline">
                🔥 Heatmap View
              </Link>
            </h3>
            <p className="text-sm text-neutral-muted">
              Geographic heatmap showing density and coverage of crisis support resources.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 text-brand-light">Contribute</h2>
        <p className="text-neutral-muted leading-relaxed mb-4">
          We welcome contributions of helpline data from any country. If you know of a crisis
          support resource not in our database, please open a pull request or issue on GitHub.
        </p>
        <a
          href="https://github.com/Kouki-odaka/open-helplines/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Contributing Guide →
        </a>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-brand-light">License</h2>
        <div className="bg-neutral-surface border border-neutral-border rounded-lg p-4 text-sm text-neutral-muted">
          <p className="mb-2">
            <strong className="text-neutral-text">Data:</strong> CC0 1.0 Universal — No rights
            reserved. Use freely for any purpose.
          </p>
          <p>
            <strong className="text-neutral-text">Code:</strong> Apache License 2.0
          </p>
        </div>
      </section>
    </article>
  );
}
