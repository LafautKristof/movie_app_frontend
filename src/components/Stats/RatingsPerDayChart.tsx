"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

type DataPoint = { date: string; count: number };

export default function RatingsPerDayChart() {
    const [chartData, setChartData] = useState<
        { date: string; global?: number; personal?: number }[]
    >([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/stats/ratings-per-day");
            const json = await res.json();

            const global: DataPoint[] = json.global;
            const personal: DataPoint[] = json.personal;

            // alle datums verzamelen
            const allDates = Array.from(
                new Set([
                    ...global.map((g) => g.date),
                    ...personal.map((p) => p.date),
                ])
            ).sort();

            // per datum combineren
            const merged = allDates.map((date) => ({
                date,
                global: global.find((g) => g.date === date)?.count ?? 0,
                personal: personal.find((p) => p.date === date)?.count ?? 0,
            }));

            setChartData(merged);
        }

        fetchData();
    }, []);

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-white">
                Ratings per dag
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis
                        dataKey="date"
                        stroke="#fff"
                        tickFormatter={(date) => {
                            // van "2025-09-01" naar "01/09"
                            const d = new Date(date);
                            return d.toLocaleDateString("nl-BE", {
                                day: "2-digit",
                                month: "short",
                            });
                        }}
                    />
                    <YAxis stroke="#fff" />
                    <Tooltip />
                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="global"
                        name="Globaal"
                        stroke="#facc15" // geel
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="personal"
                        name="Jouw ratings"
                        stroke="#3b82f6" // blauw
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
