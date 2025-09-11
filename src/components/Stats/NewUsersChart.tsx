"use client";
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function NewUsersChart() {
    const [data, setData] = useState<{ date: string; count: number }[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/stats/users-per-day");
                if (!res.ok) {
                    console.error("❌ API error:", res.status);
                    setData([]);
                    return;
                }
                const json = await res.json();
                // Zorg dat het altijd een array is
                if (Array.isArray(json)) {
                    setData(json);
                } else {
                    console.warn("❌ Unexpected response:", json);
                    setData([]);
                }
            } catch (err) {
                console.error("❌ Fetch failed:", err);
                setData([]);
            }
        }
        fetchData();
    }, []);
    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4 text-white">
                📈 Nieuwe leden per dag
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                        dataKey="date"
                        stroke="#fff"
                        tickFormatter={(d) =>
                            new Date(d).toLocaleDateString("nl-BE", {
                                day: "2-digit",
                                month: "short",
                            })
                        }
                    />
                    <YAxis stroke="#fff" />
                    <Tooltip
                        labelFormatter={(d) =>
                            new Date(d).toLocaleDateString("nl-BE", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })
                        }
                    />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
