import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { apiFetch } from "../services/api";

const COLORS = ["#2dd4bf", "#fb7185", "#38bdf8", "#a78bfa", "#facc15"];

const Charts = () => {
    const [monthly, setMonthly] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await apiFetch("/analytics");
                const data = await res.json();

                setMonthly(Array.isArray(data.monthlyData) ? data.monthlyData : []);
                setCategories(
                    Array.isArray(data.categoryData)
                        ? data.categoryData.map((c) => ({
                            category: c._id,
                            amount: c.total,
                        }))
                        : []
                );
            } catch (err) {
                console.error("Analytics fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <p className="text-gray-400">Loading charts...</p>;

    return (
        <div className="space-y-8">

            {/* ================= BAR CHART ================= */}
            {monthly.length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h2 className="text-gray-200 font-bold mb-4">
                        Monthly Income vs Expense
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthly}>
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #2dd4bf",
                                    borderRadius: "10px",
                                    color: "#e5e7eb",
                                }}
                                formatter={(value) => `₹${value}`}
                            />

                            <Bar
                                dataKey="income"
                                fill="#2dd4bf"
                                animationDuration={800}
                            />
                            <Bar
                                dataKey="expense"
                                fill="#fb7185"
                                animationBegin={150}
                                animationDuration={800}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* ================= PIE CHART ================= */}
            {categories.length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h2 className="text-gray-200 font-bold mb-4">
                        Expense by Category
                    </h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categories}
                                dataKey="amount"
                                nameKey="category"
                                outerRadius={110}
                                animationDuration={800}
                                stroke="#020617"
                                strokeWidth={2}
                            >
                                {categories.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[i % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            {/* 👇 SIDE LABELS */}
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                formatter={(value, entry, index) => {
                                    const amount = categories[index]?.amount;
                                    return (
                                        <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                                            {value} : ₹{amount}
                                        </span>
                                    );
                                }}
                            />

                            {/* Tooltip can stay */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",   // dark background
                                    border: "1px solid #2dd4bf",
                                    borderRadius: "12px",
                                    color: "#ffffff",             // ✅ FORCE WHITE TEXT
                                }}
                                itemStyle={{
                                    color: "#ffffff",             // ✅ value text (₹5000)
                                    fontWeight: "500",
                                }}
                                labelStyle={{
                                    color: "#ffffff",             // ✅ label text (lunch)
                                    fontWeight: "600",
                                }}
                                formatter={(value) => `₹${value}`}
                            />

                        </PieChart>
                    </ResponsiveContainer>

                </div>
            )}
        </div>
    );
};

export default Charts;
