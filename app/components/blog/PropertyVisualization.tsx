'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PCA } from 'ml-pca';
import { Config, ModeBarDefaultButtons } from 'plotly.js';

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

interface PropertyVisualizationProps {
  properties: Property[];
}

export default function PropertyVisualization({ properties }: PropertyVisualizationProps) {
  const [is3DReady, setIs3DReady] = useState(false);
  const [pcaData, setPcaData] = useState<{
    coords: number[][];
    explainedVariance: number[];
  } | null>(null);

  useEffect(() => {
    setIs3DReady(true);

    const vectors = properties.map(p => p.vector);

    const pca = new PCA(vectors);
    const projected = pca.predict(vectors, { nComponents: 3 });
    const variance = pca.getExplainedVariance();

    setPcaData({
      coords: projected.to2DArray(),
      explainedVariance: variance.slice(0, 3),
    });
  }, [properties]);

  if (!is3DReady || !pcaData) {
    return (
      <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading 3D visualization...</p>
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
    z: items.map(p => p.coords[2]),
    mode: 'markers',
    type: 'scatter3d',
    name,
    marker: {
      size: 10,
      color,
      line: {
        color: 'white',
        width: 2,
      },
    },
    text: items.map(p =>
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
    scene: {
      xaxis: {
        title: `PC1 (${(pcaData.explainedVariance[0] * 100).toFixed(1)}% variance)`,
        gridcolor: '#e5e7eb',
        zerolinecolor: '#9ca3af',
      },
      yaxis: {
        title: `PC2 (${(pcaData.explainedVariance[1] * 100).toFixed(1)}% variance)`,
        gridcolor: '#e5e7eb',
        zerolinecolor: '#9ca3af',
      },
      zaxis: {
        title: `PC3 (${(pcaData.explainedVariance[2] * 100).toFixed(1)}% variance)`,
        gridcolor: '#e5e7eb',
        zerolinecolor: '#9ca3af',
      },
      bgcolor: '#f9fafb',
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { l: 0, r: 0, b: 0, t: 40 },
    legend: {
      x: 0.7,
      y: 0.9,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      bordercolor: '#d1d5db',
      borderwidth: 1,
    },
    hovermode: 'closest',
  };

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'] as ModeBarDefaultButtons[],
  };

  return (
    <div className="w-full my-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Property Vectors in 3D Space
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          The 9-dimensional vectors reduced to 3D using PCA.
          Rotate and hover to explore the properties.
        </p>
        <div className="w-full" style={{ height: '600px' }}>
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
            PC2 captures {(pcaData.explainedVariance[1] * 100).toFixed(1)}%,
            and PC3 captures {(pcaData.explainedVariance[2] * 100).toFixed(1)}%.
            Together they explain{' '}
            {(pcaData.explainedVariance.slice(0, 3).reduce((a, b) => a + b, 0) * 100).toFixed(1)}%
            of the total variance in the original 9D space.
          </p>
        </div>
      </div>
    </div>
  );
}
