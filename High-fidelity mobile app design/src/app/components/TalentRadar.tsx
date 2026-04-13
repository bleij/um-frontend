import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useId } from 'react';

interface TalentData {
  talent: string;
  value: number;
  fullMark: number;
}

interface TalentRadarProps {
  data: TalentData[];
  isDark?: boolean;
  instanceId?: string;
}

export function TalentRadar({ data, isDark = false, instanceId }: TalentRadarProps) {
  // Use React's useId for truly unique IDs across all instances
  const reactId = useId();
  const uniqueId = instanceId ? `${instanceId}-${reactId}` : reactId;
  const filterId = `glow-${uniqueId}`;
  const gradientId = `radarGradient-${uniqueId}`;
  
  return (
    <div key={uniqueId} style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} id={uniqueId}>
          <defs>
            <filter id={filterId}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#b794f6" : "#6200EE"} stopOpacity={0.8}/>
              <stop offset="100%" stopColor={isDark ? "#7c3aed" : "#6200EE"} stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <PolarGrid 
            stroke={isDark ? "rgba(183, 148, 246, 0.2)" : "rgba(98, 0, 238, 0.2)"} 
            strokeWidth={1.5}
            key={`grid-${uniqueId}`}
          />
          <PolarAngleAxis 
            dataKey="talent" 
            tick={{ 
              fill: isDark ? "#f5f5f7" : "#1a1a2e",
              fontSize: 12,
            }}
            tickLine={false}
            key={`axis-${uniqueId}`}
          />
          <Radar
            name="Talent Level"
            dataKey="value"
            stroke={isDark ? "#b794f6" : "#6200EE"}
            fill={`url(#${gradientId})`}
            strokeWidth={3}
            fillOpacity={0.6}
            filter={isDark ? `url(#${filterId})` : undefined}
            key={`radar-${uniqueId}`}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}