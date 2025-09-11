// app/stats/page.tsx
import DonutChart from "@/components/Stats/DonutChart";
import NewUsersChart from "@/components/Stats/NewUsersChart";
import RatingsPerDayChart from "@/components/Stats/RatingsPerDayChart";

export default function StatsPage() {
    return (
        <>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">📊 Stats</h1>
                <RatingsPerDayChart />
            </div>
            <div>
                <DonutChart />
            </div>
            <div className="p-6 grid grid-cols-1 gap-6">
                <NewUsersChart />
            </div>
        </>
    );
}
