"use client";

import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#3b82f6", "#facc15"]; // rood, blauw, geel

export default function OverviewDonuts() {
    const [globalData, setGlobalData] = useState<any[]>([]);
    const [personalData, setPersonalData] = useState<any[]>([]);
    const [globalUsers, setGlobalUsers] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/stats/overview");
            const data = await res.json();

            setGlobalData([
                { name: "Favorites", value: data.global.favorites },
                { name: "Watchlist", value: data.global.watchlist },
                { name: "Ratings", value: data.global.ratings },
            ]);

            setPersonalData([
                { name: "Favorites", value: data.personal.favorites },
                { name: "Watchlist", value: data.personal.watchlist },
                { name: "Ratings", value: data.personal.ratings },
            ]);
            setGlobalUsers(data.global.users);
        }

        fetchData();
    }, []);

    function renderDonut(data: any[], title: string, extra?: string) {
        return (
            <div className="flex-1 bg-gray-900 p-4 rounded-lg shadow">
                <h2 className="text-lg font-bold mb-2 text-white">{title}</h2>
                {extra && <p className="text-sm text-gray-400 mb-4">{extra}</p>}
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            innerRadius={50}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderDonut(
                globalData,
                "🌍 Globaal overzicht",
                `${globalUsers} leden`
            )}
            ,{renderDonut(personalData, "🙋 Jouw overzicht")}
        </div>
    );
}
