
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressChart as ProgressChartType } from "@/lib/types";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { AreaChart, Area } from "recharts";
import { Activity, Calendar, TrendingUp } from "lucide-react";

interface ProgressChartProps {
  data?: ProgressChartType[];
  isLoading?: boolean;
}

const ProgressChart = ({ data = [], isLoading = false }: ProgressChartProps) => {
  const [chartData, setChartData] = useState<ProgressChartType[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  
  useEffect(() => {
    if (data.length > 0) {
      setChartData(data);
    } else {
      // Generate sample data if none is provided
      const sampleData = generateSampleData(timeframe === 'week' ? 7 : 30);
      setChartData(sampleData);
    }
  }, [data, timeframe]);
  
  const generateSampleData = (days: number): ProgressChartType[] => {
    return Array.from({ length: days }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      // Generate slightly increasing steps with some randomness
      const baseDailySteps = 6000 + (i * 100);
      const randomVariance = Math.floor(Math.random() * 2000) - 1000;
      const steps = Math.max(1000, baseDailySteps + randomVariance);
      
      return {
        date: date.toISOString().split('T')[0],
        steps,
        distance: parseFloat((steps * 0.0008).toFixed(2)),
        calories: Math.floor(steps * 0.05),
        active_minutes: Math.floor(steps / 150)
      };
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted animate-pulse rounded-full"></div>
            <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
          </CardTitle>
          <CardDescription>
            <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-full bg-muted animate-pulse rounded mb-4"></div>
          <div className="h-80 w-full bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Progress Tracking
        </CardTitle>
        <CardDescription>
          Track your fitness progress over time
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as 'week' | 'month')}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="week">Past Week</TabsTrigger>
              <TabsTrigger value="month">Past Month</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="week" className="w-full">
            <div className="space-y-8">
              <div className="h-80">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Daily Steps
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                    />
                    <YAxis 
                      width={35}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.toLocaleString()}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value) => [Number(value).toLocaleString(), 'Steps']}
                      labelFormatter={formatDate}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        padding: '10px', 
                        border: '1px solid #eaeaea',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="steps" 
                      stroke="#818cf8" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorSteps)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Activity Comparison
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      width={40}
                      orientation="left"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value} min`}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="right"
                      width={40}
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value} cal`}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'active_minutes') return [`${value} min`, 'Active Time'];
                        if (name === 'calories') return [`${value} cal`, 'Calories'];
                        return [value, name];
                      }}
                      labelFormatter={formatDate}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        padding: '10px', 
                        border: '1px solid #eaeaea',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="active_minutes" 
                      name="Active Time" 
                      fill="#64748b" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="calories" 
                      name="Calories" 
                      fill="#f59e0b" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="w-full">
            <div className="h-80">
              <h4 className="text-sm font-medium mb-2">Monthly Progress</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    interval={3}
                  />
                  <YAxis 
                    width={35}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'steps') return [Number(value).toLocaleString(), 'Steps'];
                      if (name === 'distance') return [`${value} km`, 'Distance'];
                      return [value, name];
                    }}
                    labelFormatter={formatDate}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      padding: '10px', 
                      border: '1px solid #eaeaea',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    name="Steps" 
                    stroke="#818cf8" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="distance"
                    name="Distance (km)" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
