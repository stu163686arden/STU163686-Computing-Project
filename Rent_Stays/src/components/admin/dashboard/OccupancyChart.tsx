import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Occupied', value: 68, color: 'hsl(152, 60%, 45%)' },
  { name: 'Available', value: 18, color: 'hsl(35, 95%, 55%)' },
  { name: 'Maintenance', value: 8, color: 'hsl(220, 25%, 18%)' },
  { name: 'Reserved', value: 6, color: 'hsl(220, 10%, 70%)' },
];

export function OccupancyChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const occupiedPercentage = Math.round((data[0].value / total) * 100);

  return (
    <div className="stat-card animate-fade-up stagger-4 h-[380px]">
      <div className="mb-4">
        <h3 className="section-title">Property Occupancy</h3>
        <p className="text-sm text-muted-foreground mt-1">Current status breakdown</p>
      </div>
      
      <div className="relative h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(40, 15%, 88%)',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
              }}
              formatter={(value: number) => [`${value} properties`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-foreground">{occupiedPercentage}%</p>
            <p className="text-xs text-muted-foreground">Occupied</p>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="text-sm font-medium text-foreground ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
