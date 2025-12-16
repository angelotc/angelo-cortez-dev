'use client';

import PropertyVisualization from './PropertyVisualization';
import PropertyVisualization2D from './PropertyVisualization2D';

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

interface PropertyVisualizationDualProps {
  properties: Property[];
}

export default function PropertyVisualizationDual({ properties }: PropertyVisualizationDualProps) {
  return (
    <div className="space-y-8">
      <PropertyVisualization properties={properties} />
      <PropertyVisualization2D properties={properties} />
    </div>
  );
}
