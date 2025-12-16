'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PCA } from 'ml-pca';
import { Config, ModeBarDefaultButtons } from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface VectorPoint {
  label: string;
  vector: number[];
  description: string;
}

interface PreferenceCentroidVisualizationProps {
  vectors: VectorPoint[];
}

export default function PreferenceCentroidVisualization({ vectors }: PreferenceCentroidVisualizationProps) {
  const [isReady, setIsReady] = useState(false);
  const [pcaData, setPcaData] = useState<{
    coords: number[][];
    centroidCoords: number[];
    explainedVariance: number[];
  } | null>(null);

  useEffect(() => {
    setIsReady(true);

    // Extract just the vectors for PCA
    const vectorData = vectors.map(v => v.vector);

    // Calculate the centroid (element-wise average)
    const centroid = vectorData[0].map((_, i) =>
      vectorData.reduce((sum, vec) => sum + vec[i], 0) / vectorData.length
    );

    // Combine vectors and centroid for PCA
    const allVectors = [...vectorData, centroid];

    const pca = new PCA(allVectors);
    const projected = pca.predict(allVectors, { nComponents: 3 });
    const variance = pca.getExplainedVariance();

    const projectedArray = projected.to2DArray();

    setPcaData({
      coords: projectedArray.slice(0, -1), // All except centroid
      centroidCoords: projectedArray[projectedArray.length - 1], // Last one is centroid
      explainedVariance: variance.slice(0, 3),
    });
  }, [vectors]);

  if (!isReady || !pcaData) {
    return (
      <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading preference centroid visualization...</p>
      </div>
    );
  }

  // Create trace for the viewed properties
  const viewedPropertiesTrace = {
    x: pcaData.coords.map(c => c[0]),
    y: pcaData.coords.map(c => c[1]),
    z: pcaData.coords.map(c => c[2]),
    mode: 'markers+text',
    type: 'scatter3d',
    name: 'Viewed Properties',
    marker: {
      size: 10,
      color: '#3b82f6', // Blue
      line: {
        color: 'white',
        width: 2,
      },
    },
    text: vectors.map((v, i) => (i + 1).toString()),
    textposition: 'top center',
    textfont: {
      color: '#3b82f6',
      size: 12,
      family: 'Arial, sans-serif',
    },
    hovertext: vectors.map(v => `<b>${v.label}</b><br>${v.description}`),
    hoverinfo: 'text',
  };

  // Create trace for the preference centroid
  const centroidTrace = {
    x: [pcaData.centroidCoords[0]],
    y: [pcaData.centroidCoords[1]],
    z: [pcaData.centroidCoords[2]],
    mode: 'markers+text',
    type: 'scatter3d',
    name: 'Preference Centroid',
    marker: {
      size: 15,
      color: '#ef4444', // Red
      symbol: 'diamond',
      line: {
        color: 'white',
        width: 2,
      },
    },
    text: ['★'],
    textposition: 'middle center',
    textfont: {
      color: 'white',
      size: 16,
      family: 'Arial, sans-serif',
    },
    hovertext: '<b>Preference Centroid</b><br>Average of viewed properties',
    hoverinfo: 'text',
  };

  // Create lines from each point to the centroid
  const lineTraces = pcaData.coords.map((coord) => ({
    x: [coord[0], pcaData.centroidCoords[0]],
    y: [coord[1], pcaData.centroidCoords[1]],
    z: [coord[2], pcaData.centroidCoords[2]],
    mode: 'lines',
    type: 'scatter3d',
    name: '',
    showlegend: false,
    line: {
      color: 'rgba(156, 163, 175, 0.3)', // Gray with transparency
      width: 2,
      dash: 'dot',
    },
    hoverinfo: 'skip',
  }));

  const data = [viewedPropertiesTrace, centroidTrace, ...lineTraces];

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
          Computing the Preference Centroid
        </h3>
        <div className="w-full" style={{ height: '600px' }}>
          <Plot
            data={data as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            layout={layout as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        </div>
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>
            Your preference vector is calculated by averaging each dimension
            across all {vectors.length} viewed properties. In this 3D projection, the centroid naturally sits
            near the &quot;center of mass&quot; of the blue points—representing your implicit preferences based on browsing behavior.
          </p>
        </div>
      </div>
    </div>
  );
}
