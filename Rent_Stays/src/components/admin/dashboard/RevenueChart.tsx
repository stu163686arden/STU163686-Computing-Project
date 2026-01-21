import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 42000, occupancy: 85 },
  { month: 'Feb', revenue: 45000, occupancy: 88 },
  { month: 'Mar', revenue: 48000, occupancy: 92 },
  { month: 'Apr', revenue: 51000, occupancy: 89 },
  { month: 'May', revenue: 53000, occupancy: 94 },
  { month: 'Jun', revenue: 56000, occupancy: 91 },
  { month: 'Jul', revenue: 62000, occupancy: 96 },
  { month: 'Aug', revenue: 58000, occupancy: 93 },
  { month: 'Sep', revenue: 55000, occupancy: 90 },
  { month: 'Oct', revenue: 59000, occupancy: 92 },
  { month: 'Nov', revenue: 64000, occupancy: 95 },
  { month: 'Dec', revenue: 68000, occupancy: 97 },
];

export function RevenueChart() {
  return (
    <div className="stat-card animate-fade-up stagger-3 h-[380px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground mt-1">Monthly rental income</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220, 10%, 45%)', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220, 10%, 45%)', fontSize: 12 }}
            tickFormatter={(value) => `£${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(0, 0%, 100%)',
              border: '1px solid hsl(40, 15%, 88%)',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
            }}
            formatter={(value: number) => [`£${value.toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(35, 95%, 55%)"
            strokeWidth={3}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
