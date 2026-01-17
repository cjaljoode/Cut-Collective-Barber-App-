"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

interface PeakHourChartProps {
  data: { hour: string; bookings: number }[]
}

export function PeakHourChart({ data }: PeakHourChartProps) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="hour" stroke="#71717a" fontSize={10} />
          <YAxis stroke="#71717a" fontSize={10} />
          <Tooltip
            contentStyle={{
              background: "#0a0a0a",
              border: "1px solid #27272a",
              color: "#e4e4e7",
            }}
          />
          <Bar dataKey="bookings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
