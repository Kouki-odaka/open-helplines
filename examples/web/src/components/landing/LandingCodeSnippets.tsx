/**
 * LandingCodeSnippets — shows how to use the open-helplines npm package.
 */

const CODE_SNIPPETS = {
  npm: `npm install open-helplines`,
  ts: `import { getHelplines } from 'open-helplines';

const lines = await getHelplines({ country: 'JP' });
console.log(lines); // [{ name: 'Yorisoi Hotline', ... }]`,
  python: `from open_helplines import get_helplines

lines = get_helplines(country="JP")
print(lines[0].name)  # Yorisoi Hotline`,
  cdn: `<script src="https://cdn.jsdelivr.net/npm/open-helplines/dist/index.umd.js"></script>`,
} as const;

export function LandingCodeSnippets() {
  return (
    <section className="border-t border-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-6">
          Use it in your project
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CodeBlock label="npm / Node.js" code={CODE_SNIPPETS.npm} language="bash" />
          <CodeBlock label="TypeScript" code={CODE_SNIPPETS.ts} language="ts" />
          <CodeBlock label="Python" code={CODE_SNIPPETS.python} language="python" />
          <CodeBlock label="CDN / Browser" code={CODE_SNIPPETS.cdn} language="html" />
        </div>
      </div>
    </section>
  );
}

interface CodeBlockProps {
  label: string;
  code: string;
  language: string;
}

function CodeBlock({ label, code, language }: CodeBlockProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
          {language}
        </span>
        <span className="text-xs text-gray-600">{label}</span>
      </div>
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto scrollbar-hidden">
        <code>{code}</code>
      </pre>
    </div>
  );
}
