'use client';

import { useEffect, useRef, useState } from 'react';
import type { CountryGlobeData } from '@/types/helpline';
import { MOCK_GLOBAL_DATA } from '@/lib/mock-data';
import { getCategoryColor } from '@/lib/viz-tokens';

/**
 * NetworkGraph — D3 force-directed network visualization.
 *
 * Node types (per visualization.md §3.2):
 * - Country: circle (r=16), seq-blue
 * - Category: hexagon (r=12), category color
 * - Language: diamond (r=10), suicide_prevention color
 * - Contact method: square (r=10), domestic_violence color
 *
 * TODO (post team-lead approval):
 * - Implement D3 force simulation
 * - Add ego-network hover highlight
 * - Add filter dropdowns (react-select)
 * - Mobile optimizations (larger nodes, weaker force)
 */

interface NetworkNode {
  id: string;
  type: 'country' | 'category' | 'language' | 'contact_method';
  label: string;
  color: string;
  r: number;
  x?: number;
  y?: number;
}

interface NetworkLink {
  source: string;
  target: string;
  weight: number;
}

function buildNetworkData(countries: CountryGlobeData[]) {
  const nodes: NetworkNode[] = [];
  const links: NetworkLink[] = [];
  const nodeIds = new Set<string>();

  const addNode = (node: NetworkNode) => {
    if (!nodeIds.has(node.id)) {
      nodes.push(node);
      nodeIds.add(node.id);
    }
  };

  for (const country of countries) {
    const countryNodeId = `country-${country.countryCode}`;
    addNode({
      id: countryNodeId,
      type: 'country',
      label: country.countryName,
      color: '#7ECBF3',
      r: 16,
    });

    for (const category of country.categories) {
      const catNodeId = `category-${category}`;
      addNode({
        id: catNodeId,
        type: 'category',
        label: category.replace(/_/g, ' '),
        color: getCategoryColor(category, 'dark'),
        r: 12,
      });
      links.push({ source: countryNodeId, target: catNodeId, weight: 1 });
    }

    for (const lang of country.languages.slice(0, 5)) {
      const langNodeId = `lang-${lang}`;
      addNode({
        id: langNodeId,
        type: 'language',
        label: lang.toUpperCase(),
        color: '#F5C842',
        r: 10,
      });
      links.push({ source: countryNodeId, target: langNodeId, weight: 1 });
    }

    for (const method of country.contactMethods) {
      const methodNodeId = `method-${method}`;
      addNode({
        id: methodNodeId,
        type: 'contact_method',
        label: method,
        color: '#00C48D',
        r: 10,
      });
      links.push({ source: countryNodeId, target: methodNodeId, weight: 1 });
    }
  }

  return { nodes, links };
}

export default function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { nodes, links } = buildNetworkData(MOCK_GLOBAL_DATA.countries);

  // Track container size
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(svgEl.parentElement ?? svgEl);
    return () => observer.disconnect();
  }, []);

  // Simple static layout (circular) — will be replaced with D3 force simulation
  const layoutNodes = nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
    return {
      ...node,
      x: dimensions.width / 2 + radius * Math.cos(angle),
      y: dimensions.height / 2 + radius * Math.sin(angle),
    };
  });

  const nodeMap = new Map(layoutNodes.map((n) => [n.id, n]));

  return (
    <div className="w-full h-full flex flex-col">
      {/* Filter bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-950/50">
        <span className="text-xs text-gray-500">Filter:</span>
        <FilterBadge label="All Countries" />
        <FilterBadge label="All Categories" />
        <FilterBadge label="All Languages" />
        <button className="ml-auto text-xs text-gray-600 hover:text-gray-400 transition-colors">
          Reset
        </button>
      </div>

      {/* SVG Graph */}
      <div className="relative flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="w-full h-full"
          aria-label={`Network graph with ${nodes.length} nodes`}
          role="img"
        >
          {/* Edges */}
          <g className="edges">
            {links.map((link, index) => {
              const source = nodeMap.get(link.source);
              const target = nodeMap.get(link.target);
              if (!source || !target) return null;
              return (
                <line
                  key={index}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={source.color}
                  strokeOpacity={0.2}
                  strokeWidth={1}
                />
              );
            })}
          </g>
          {/* Nodes */}
          <g className="nodes">
            {layoutNodes.map((node) => (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`${node.type}: ${node.label}`}
              >
                <circle
                  r={node.r}
                  fill={node.color}
                  fillOpacity={0.85}
                  stroke="white"
                  strokeWidth={1.5}
                  strokeOpacity={0.6}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={node.r > 12 ? 8 : 7}
                  fill="white"
                  fillOpacity={0.9}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.label.slice(0, 4)}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-gray-950/80 border border-gray-800 rounded-lg px-3 py-2 text-xs">
          <div className="font-medium text-gray-400 mb-1.5">Node types</div>
          {[
            { color: '#7ECBF3', label: 'Country', shape: 'circle' },
            { color: '#F5C842', label: 'Language', shape: 'diamond' },
            { color: '#00C48D', label: 'Contact method', shape: 'square' },
            { color: '#E69F00', label: 'Category', shape: 'hexagon' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterBadge({ label }: { label: string }) {
  return (
    <button className="text-xs bg-gray-800 text-gray-400 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors">
      {label} ▾
    </button>
  );
}

// Screen-reader accessible table (per UX spec §5.4)
export function NetworkAccessibilityTable({ countries }: { countries: CountryGlobeData[] }) {
  return (
    <table className="sr-only" aria-label="Helplines network data">
      <caption>Network of helplines by country, category and language</caption>
      <thead>
        <tr>
          <th>Country</th>
          <th>Categories</th>
          <th>Languages</th>
          <th>Contact Methods</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((country) => (
          <tr key={country.countryCode}>
            <td>{country.countryName}</td>
            <td>{country.categories.join(', ')}</td>
            <td>{country.languages.join(', ')}</td>
            <td>{country.contactMethods.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
