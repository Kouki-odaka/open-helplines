'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTranslations } from 'next-intl';
import { useHelplinesData } from '@/lib/use-helplines-data';
import { getCategoryColor } from '@/lib/viz-tokens';
import type { CountryGlobeData, HelplineCategory } from '@/types/helpline';

// ─── Constants ───────────────────────────────────────────────────────────────

const MOBILE_NODE_LIMIT = 50;
const MOBILE_BREAKPOINT_PX = 640;

const NODE_BASE_COLOR = {
  country: '#7ECBF3',
  language: '#F5C842',
  contact_method: '#00C48D',
} as const;

const FORCE_CONFIG = {
  chargeStrength: -120,
  linkDistance: 80,
  collideRadius: 22,
  alphaDecay: 0.028,
} as const;

const EDGE_OPACITY_NORMAL = 0.3;
const EDGE_OPACITY_HIGHLIGHTED = 0.7;
const EDGE_OPACITY_FADED = 0.04;
const NODE_OPACITY_FADED = 0.2;

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType = 'country' | 'category' | 'language' | 'contact_method';

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  type: NodeType;
  label: string;
  color: string;
  nodeRadius: number;
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  weight: number;
}

// ─── SVG shape path generators ───────────────────────────────────────────────

function buildHexagonPath(r: number): string {
  const vertices = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI) / 3 - Math.PI / 6;
    return `${r * Math.cos(angle)},${r * Math.sin(angle)}`;
  });
  return `M${vertices.join('L')}Z`;
}

function buildDiamondPath(r: number): string {
  return `M0,-${r} L${r * 0.7},0 L0,${r} L-${r * 0.7},0Z`;
}

function buildSquarePath(r: number): string {
  const halfSide = r * 0.85;
  return `M-${halfSide},-${halfSide} L${halfSide},-${halfSide} L${halfSide},${halfSide} L-${halfSide},${halfSide}Z`;
}

function getShapePath(nodeType: NodeType, r: number): string {
  if (nodeType === 'category') return buildHexagonPath(r);
  if (nodeType === 'language') return buildDiamondPath(r);
  if (nodeType === 'contact_method') return buildSquarePath(r);
  return ''; // country uses <circle>
}

// ─── Data transformer ────────────────────────────────────────────────────────

function buildNetworkData(
  countries: CountryGlobeData[],
  filterCountryCode: string,
  filterCategoryName: string,
  isMobile: boolean
): { nodes: NetworkNode[]; links: NetworkLink[] } {
  const nodes: NetworkNode[] = [];
  const links: NetworkLink[] = [];
  const seenNodeIds = new Set<string>();

  function ensureNode(node: NetworkNode): void {
    if (!seenNodeIds.has(node.id)) {
      nodes.push(node);
      seenNodeIds.add(node.id);
    }
  }

  const filteredCountries = countries
    .filter((c) => !filterCountryCode || c.countryCode === filterCountryCode)
    .filter((c) => !filterCategoryName || c.categories.includes(filterCategoryName as HelplineCategory));

  for (const country of filteredCountries) {
    const countryNodeId = `country-${country.countryCode}`;
    ensureNode({
      id: countryNodeId,
      type: 'country',
      label: country.countryName,
      color: NODE_BASE_COLOR.country,
      nodeRadius: 16,
    });

    for (const categoryName of country.categories) {
      const categoryNodeId = `cat-${categoryName}`;
      ensureNode({
        id: categoryNodeId,
        type: 'category',
        label: categoryName.replace(/_/g, ' '),
        color: getCategoryColor(categoryName, 'dark'),
        nodeRadius: 12,
      });
      links.push({ source: countryNodeId, target: categoryNodeId, weight: 1 });
    }

    for (const languageCode of country.languages.slice(0, 4)) {
      const languageNodeId = `lang-${languageCode}`;
      ensureNode({
        id: languageNodeId,
        type: 'language',
        label: languageCode.toUpperCase(),
        color: NODE_BASE_COLOR.language,
        nodeRadius: 10,
      });
      links.push({ source: countryNodeId, target: languageNodeId, weight: 1 });
    }

    for (const contactMethod of country.contactMethods) {
      const methodNodeId = `method-${contactMethod}`;
      ensureNode({
        id: methodNodeId,
        type: 'contact_method',
        label: contactMethod,
        color: NODE_BASE_COLOR.contact_method,
        nodeRadius: 10,
      });
      links.push({ source: countryNodeId, target: methodNodeId, weight: 1 });
    }
  }

  if (isMobile && nodes.length > MOBILE_NODE_LIMIT) {
    const limitedNodes = nodes.slice(0, MOBILE_NODE_LIMIT);
    const limitedNodeIds = new Set(limitedNodes.map((n) => n.id));
    return {
      nodes: limitedNodes,
      links: links.filter(
        (l) =>
          limitedNodeIds.has(l.source as string) &&
          limitedNodeIds.has(l.target as string)
      ),
    };
  }

  return { nodes, links };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationStopRef = useRef<(() => void) | null>(null);
  const t = useTranslations('network');

  const [filterCountryCode, setFilterCountryCode] = useState('');
  const [filterCategoryName, setFilterCategoryName] = useState('');
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);

  const { data: helplinesData } = useHelplinesData();
  const allCountries = helplinesData.countries;

  const countrySelectOptions = allCountries.map((c) => ({
    value: c.countryCode,
    label: c.countryName,
  }));

  const allCategoryNames = Array.from(
    new Set(allCountries.flatMap((c) => c.categories))
  ).sort();

  // ── Derive hovered country detail for tooltip panel ──────────────────────

  const hoveredCountry = hoveredCountryCode
    ? allCountries.find((c) => c.countryCode === hoveredCountryCode) ?? null
    : null;

  // ── D3 imperative render ─────────────────────────────────────────────────

  useEffect(() => {
    const svgElement = svgRef.current;
    const containerElement = containerRef.current;
    if (!svgElement || !containerElement) return;

    const isMobile = containerElement.clientWidth < MOBILE_BREAKPOINT_PX;
    const { nodes, links } = buildNetworkData(
      allCountries,
      filterCountryCode,
      filterCategoryName,
      isMobile
    );

    const canvasWidth = containerElement.clientWidth || 800;
    const canvasHeight = containerElement.clientHeight || 600;

    d3.select(svgElement).selectAll('*').remove();

    if (nodes.length === 0) {
      d3.select(svgElement)
        .append('text')
        .attr('x', canvasWidth / 2)
        .attr('y', canvasHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#6B7280')
        .attr('font-size', 14)
        .text('No data matches current filters');
      return;
    }

    const rootGroup = d3.select(svgElement).append('g').attr('class', 'network-root');

    // ── Zoom ──────────────────────────────────────────────────────────────

    const zoomHandler = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 6])
      .on('zoom', (zoomEvent) => {
        rootGroup.attr('transform', String(zoomEvent.transform));
      });

    d3.select(svgElement)
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .call(zoomHandler)
      .on('dblclick.zoom', null);

    // ── Adjacency index for ego-network highlight ──────────────────────────

    function getAdjacentNodeIds(targetNodeId: string): Set<string> {
      const adjacentIds = new Set<string>([targetNodeId]);
      for (const link of links) {
        const sourceId =
          typeof link.source === 'string' ? link.source : (link.source as NetworkNode).id;
        const targetId =
          typeof link.target === 'string' ? link.target : (link.target as NetworkNode).id;
        if (sourceId === targetNodeId) adjacentIds.add(targetId);
        if (targetId === targetNodeId) adjacentIds.add(sourceId);
      }
      return adjacentIds;
    }

    // ── Edges ──────────────────────────────────────────────────────────────

    const edgeGroup = rootGroup.append('g').attr('class', 'network-edges');
    const linkSelection = edgeGroup
      .selectAll<SVGLineElement, NetworkLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', '#4B5563')
      .attr('stroke-opacity', EDGE_OPACITY_NORMAL)
      .attr('stroke-width', 1);

    // ── Nodes ──────────────────────────────────────────────────────────────

    const nodeGroup = rootGroup.append('g').attr('class', 'network-nodes');
    const nodeSelection = nodeGroup
      .selectAll<SVGGElement, NetworkNode>('g.network-node')
      .data(nodes, (d) => d.id)
      .join('g')
      .attr('class', 'network-node')
      .attr('cursor', 'pointer')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d) => `${d.type}: ${d.label}`);

    // Draw shape + label per node
    nodeSelection.each(function drawNodeShapeAndLabel(nodeData) {
      const nodeEl = d3.select(this);

      if (nodeData.type === 'country') {
        nodeEl
          .append('circle')
          .attr('r', nodeData.nodeRadius)
          .attr('fill', nodeData.color)
          .attr('fill-opacity', 0.85)
          .attr('stroke', 'rgba(255,255,255,0.6)')
          .attr('stroke-width', 1.5);
      } else {
        nodeEl
          .append('path')
          .attr('d', getShapePath(nodeData.type, nodeData.nodeRadius))
          .attr('fill', nodeData.color)
          .attr('fill-opacity', 0.85)
          .attr('stroke', 'rgba(255,255,255,0.6)')
          .attr('stroke-width', 1.5);
      }

      const maxLabelChars = nodeData.type === 'country' ? 6 : 4;
      nodeEl
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', nodeData.nodeRadius > 12 ? 8 : 7)
        .attr('fill', 'white')
        .attr('fill-opacity', 0.9)
        .attr('pointer-events', 'none')
        .style('user-select', 'none')
        .text(nodeData.label.slice(0, maxLabelChars));
    });

    // ── Hover: ego-network highlight ──────────────────────────────────────

    nodeSelection
      .on('mouseover', (_hoverEvent, hoveredNodeData) => {
        const adjacentIds = getAdjacentNodeIds(hoveredNodeData.id);

        linkSelection.attr('stroke-opacity', (linkData) => {
          const sourceId =
            typeof linkData.source === 'string'
              ? linkData.source
              : (linkData.source as NetworkNode).id;
          const targetId =
            typeof linkData.target === 'string'
              ? linkData.target
              : (linkData.target as NetworkNode).id;
          const isConnected = adjacentIds.has(sourceId) && adjacentIds.has(targetId);
          return isConnected ? EDGE_OPACITY_HIGHLIGHTED : EDGE_OPACITY_FADED;
        });

        nodeSelection.attr('opacity', (nodeData) =>
          adjacentIds.has(nodeData.id) ? 1 : NODE_OPACITY_FADED
        );

        if (hoveredNodeData.type === 'country') {
          setHoveredCountryCode(
            hoveredNodeData.id.replace('country-', '')
          );
        }
      })
      .on('mouseout', () => {
        linkSelection.attr('stroke-opacity', EDGE_OPACITY_NORMAL);
        nodeSelection.attr('opacity', 1);
        setHoveredCountryCode(null);
      });

    // ── Drag behavior ─────────────────────────────────────────────────────

    function handleDragStart(
      dragEvent: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>,
      draggedNode: NetworkNode
    ) {
      if (!dragEvent.active) simulation.alphaTarget(0.3).restart();
      draggedNode.fx = draggedNode.x;
      draggedNode.fy = draggedNode.y;
    }

    function handleDragMove(
      dragEvent: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>,
      draggedNode: NetworkNode
    ) {
      draggedNode.fx = dragEvent.x;
      draggedNode.fy = dragEvent.y;
    }

    function handleDragEnd(
      dragEvent: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>,
      draggedNode: NetworkNode
    ) {
      if (!dragEvent.active) simulation.alphaTarget(0);
      draggedNode.fx = null;
      draggedNode.fy = null;
    }

    const dragBehavior = d3
      .drag<SVGGElement, NetworkNode>()
      .on('start', handleDragStart)
      .on('drag', handleDragMove)
      .on('end', handleDragEnd);

    nodeSelection.call(dragBehavior);

    // ── Force simulation ──────────────────────────────────────────────────

    const simulation = d3
      .forceSimulation<NetworkNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<NetworkNode, NetworkLink>(links)
          .id((nodeData) => nodeData.id)
          .distance(FORCE_CONFIG.linkDistance)
      )
      .force('charge', d3.forceManyBody().strength(FORCE_CONFIG.chargeStrength))
      .force('center', d3.forceCenter(canvasWidth / 2, canvasHeight / 2))
      .force('collide', d3.forceCollide<NetworkNode>(FORCE_CONFIG.collideRadius))
      .alphaDecay(FORCE_CONFIG.alphaDecay)
      .on('tick', () => {
        linkSelection
          .attr('x1', (d) => (d.source as NetworkNode).x ?? 0)
          .attr('y1', (d) => (d.source as NetworkNode).y ?? 0)
          .attr('x2', (d) => (d.target as NetworkNode).x ?? 0)
          .attr('y2', (d) => (d.target as NetworkNode).y ?? 0);

        nodeSelection.attr(
          'transform',
          (d) => `translate(${d.x ?? 0},${d.y ?? 0})`
        );
      });

    simulationStopRef.current = () => simulation.stop();

    return () => {
      simulation.stop();
    };
  }, [allCountries, filterCountryCode, filterCategoryName]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      simulationStopRef.current?.();
    };
  }, []);

  const hasActiveFilters = filterCountryCode !== '' || filterCategoryName !== '';

  return (
    <div className="w-full h-full flex flex-col">
      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-800 bg-gray-950/60 flex-wrap">
        <select
          value={filterCountryCode}
          onChange={(e) => setFilterCountryCode(e.target.value)}
          className="text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[130px]"
          aria-label={t('filterCountry')}
        >
          <option value="">{t('allCountries')}</option>
          {countrySelectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filterCategoryName}
          onChange={(e) => setFilterCategoryName(e.target.value)}
          className="text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[130px]"
          aria-label={t('filterCategory')}
        >
          <option value="">{t('allCategories')}</option>
          {allCategoryNames.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setFilterCountryCode('');
              setFilterCategoryName('');
            }}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors ml-auto"
          >
            Reset ×
          </button>
        )}
      </div>

      {/* ── Graph canvas ──────────────────────────────────────────────────── */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden bg-gray-950">
        <svg
          ref={svgRef}
          className="w-full h-full"
          aria-label="Force-directed network of global helplines"
          role="img"
        />

        {/* Country hover tooltip */}
        {hoveredCountry && (
          <div
            className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2.5 text-xs max-w-[200px] pointer-events-none"
            aria-live="polite"
          >
            <div className="font-semibold text-white mb-1">
              {hoveredCountry.countryName}
            </div>
            <div className="text-gray-400">
              {hoveredCountry.helplineCount} helpline
              {hoveredCountry.helplineCount !== 1 ? 's' : ''}
            </div>
            <div className="text-gray-500 mt-0.5">
              {hoveredCountry.categories.length} categor
              {hoveredCountry.categories.length !== 1 ? 'ies' : 'y'}
            </div>
            <div className="text-gray-500">
              {hoveredCountry.languages.length} language
              {hoveredCountry.languages.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {/* Node-type legend */}
        <div className="absolute bottom-3 left-3 bg-gray-950/85 border border-gray-800 rounded-lg px-3 py-2.5 text-xs">
          <div className="font-medium text-gray-400 mb-2">Node types</div>
          <div className="space-y-1.5">
            {[
              { color: NODE_BASE_COLOR.country, label: 'Country', symbol: '●' },
              { color: '#E69F00', label: 'Category', symbol: '⬡' },
              { color: NODE_BASE_COLOR.language, label: 'Language', symbol: '◆' },
              {
                color: NODE_BASE_COLOR.contact_method,
                label: 'Contact method',
                symbol: '■',
              },
            ].map(({ color, label, symbol }) => (
              <div key={label} className="flex items-center gap-2">
                <span style={{ color }} aria-hidden="true" className="text-sm leading-none">
                  {symbol}
                </span>
                <span className="text-gray-500">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-800 text-gray-600 text-[10px]">
            Hover to highlight · Drag to rearrange
          </div>
        </div>

        {/* Zoom hint */}
        <div className="absolute top-3 left-3 text-[10px] text-gray-600 pointer-events-none select-none">
          Scroll / pinch to zoom
        </div>
      </div>

      {/* SR-only accessibility table */}
      <NetworkAccessibilityTable countries={allCountries} />
    </div>
  );
}

// ─── Screen-reader accessible data table (UX spec §5.4) ─────────────────────

export function NetworkAccessibilityTable({
  countries,
}: {
  countries: CountryGlobeData[];
}) {
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
