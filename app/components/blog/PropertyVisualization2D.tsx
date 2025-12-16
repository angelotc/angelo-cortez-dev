'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PCA } from 'ml-pca';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Property {
  id: string;
  location: string;
  price: number;
  size: number;
  rooms: string;
  yearBuilt: number;
  type: 'condo' | 'house';
  vector: number[];
}

interface PropertyVisualization2DProps {
  properties: Property[];
}

export default function PropertyVisualization2D({ properties }: PropertyVisualization2DProps) {
  const [is2DReady, setIs2DReady] = useState(false);
  const [pcaData, setPcaData] = useState<{
    coords: number[][];
    explainedVariance: number[];
  } | null>(null);

  useEffect(() => {
    setIs2DReady(true);

    const vectors = properties.map(p => p.vector);

    const pca = new PCA(vectors);
    const projected = pca.predict(vectors, { nComponents: 2 });
    const variance = pca.getExplainedVariance();

    setPcaData({
      coords: projected.to2DArray(),
      explainedVariance: variance.slice(0, 2),
    });
  }, [properties]);

  if (!is2DReady || !pcaData) {
    return (
      <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading 2D visualization...</p>
      </div>
    );
  }

  const condos = properties
    .map((p, i) => ({ ...p, coords: pcaData.coords[i] }))
    .filter(p => p.type === 'condo');

  const houses = properties
    .map((p, i) => ({ ...p, coords: pcaData.coords[i] }))
    .filter(p => p.type === 'house');

  const formatPrice = (price: number) => `¥${(price / 1000000).toFixed(1)}M`;

  const createTrace = (items: typeof condos, name: string, color: string) => ({
    x: items.map(p => p.coords[0]),
    y: items.map(p => p.coords[1]),
    mode: 'markers+text',
    type: 'scatter',
    name,
    marker: {
      size: 12,
      color,
      line: {
        color: 'white',
        width: 2,
      },
    },
    text: items.map((_, i) => (i + 1).toString()),
    textposition: 'middle center',
    textfont: {
      color: 'white',
      size: 10,
      family: 'Arial, sans-serif',
    },
    hovertext: items.map(p =>
      `<b>${p.location}</b><br>` +
      `Price: ${formatPrice(p.price)}<br>` +
      `Size: ${p.size}㎡<br>` +
      `Rooms: ${p.rooms}<br>` +
      `Built: ${p.yearBuilt}<br>` +
      `ID: ${p.id}`
    ),
    hoverinfo: 'text',
  });

  const data = [
    createTrace(condos, 'Tokyo Condos', '#3b82f6'),
    createTrace(houses, 'Hokkaido Houses', '#f97316'),
  ];

  const layout = {
    autosize: true,
    xaxis: {
      title: `PC1 (${(pcaData.explainedVariance[0] * 100).toFixed(1)}% variance)`,
      gridcolor: '#e5e7eb',
      zerolinecolor: '#9ca3af',
      showgrid: true,
    },
    yaxis: {
      title: `PC2 (${(pcaData.explainedVariance[1] * 100).toFixed(1)}% variance)`,
      gridcolor: '#e5e7eb',
      zerolinecolor: '#9ca3af',
      showgrid: true,
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: '#f9fafb',
    margin: { l: 60, r: 40, b: 60, t: 40 },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      bordercolor: '#d1d5db',
      borderwidth: 1,
    },
    hovermode: 'closest',
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'lasso2d', 'select2d'],
  };

  return (
    <div className="w-full my-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Property Vectors in 2D Space
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          The 9-dimensional vectors reduced to 2D using PCA.
          Hover over points to see property details.
        </p>
        <div className="w-full" style={{ height: '500px' }}>
          <Plot
            data={data as any}
            layout={layout as any}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        </div>
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>
            <strong>Principal Components:</strong> PC1 captures{' '}
            {(pcaData.explainedVariance[0] * 100).toFixed(1)}% of variance,
            PC2 captures {(pcaData.explainedVariance[1] * 100).toFixed(1)}%.
            Together they explain{' '}
            {(pcaData.explainedVariance.slice(0, 2).reduce((a, b) => a + b, 0) * 100).toFixed(1)}%
            of the total variance in the original 9D space.
          </p>
        </div>
      </div>
    </div>
  );
}
