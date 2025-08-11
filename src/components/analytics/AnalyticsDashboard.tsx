import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';
import { fetchPostMetrics } from '../../lib/api';
import type { PostMetrics } from '../../types';

interface AnalyticsDashboardProps {
  postIds: string[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ postIds }) => {
  const [metrics, setMetrics] = useState<PostMetrics[]>([]);

  useEffect(() => {
    if (postIds.length === 0) return;
    fetchPostMetrics(postIds).then(setMetrics).catch(console.error);
  }, [postIds]);

  const platforms = Array.from(new Set(metrics.map((m) => m.platform)));

  const chartData = postIds.map((id) => {
    const entry: Record<string, string | number> = { post: id };
    metrics
      .filter((m) => m.postId === id)
      .forEach((m) => {
        entry[m.platform] = m.views;
      });
    return entry;
  });

  const colors: Record<string, string> = {
    LinkedIn: '#0e76a8',
    Twitter: '#1DA1F2',
    Facebook: '#1877F2',
  };

  return (
    <Card title="Post Performance">
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="post" />
            <YAxis />
            <Tooltip />
            <Legend />
            {platforms.map((p) => (
              <Bar key={p} dataKey={p} fill={colors[p] || '#8884d8'} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AnalyticsDashboard;
