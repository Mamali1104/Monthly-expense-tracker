import { useEffect, useState } from "react";
import AddTransaction from "../components/AddTransaction";
import Charts from "../components/Charts";
import toast from "react-hot-toast";
import { apiFetch } from "../services/api";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTx, setEditingTx] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  /* ================= FETCH SUMMARY ================= */
  const fetchSummary = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/dashboard/summary");
      const data = await res.json();

      // 🔐 SAFETY: validate response shape
      setSummary({
        totalIncome: data.totalIncome || 0,
        totalExpense: data.totalExpense || 0,
        balance: data.balance || 0,
        recentTransactions: data.recentTransactions || [],
      });
    } catch (err) {
      console.error("Dashboard fetch failed", err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REFRESH CHARTS ================= */
  const refreshCharts = () => {
    setRefreshKey((prev) => prev + 1);
  };

  /* ================= DELETE TRANSACTION ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await apiFetch(`/transactions/${id}`, { method: "DELETE" });
      toast.success("Transaction deleted");
      fetchSummary();
      refreshCharts();
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  /* ================= STATES ================= */
  if (loading) {
    return <p className="p-4 text-gray-400">Loading...</p>;
  }

  if (!summary) {
    return (
      <div className="p-4 text-rose-400">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]">
          Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-rose-500 text-white px-4 py-2 rounded-lg
                     hover:bg-rose-600 transition
                     hover-glow"
        >
          Logout
        </button>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Income" value={summary.totalIncome} color="teal" />
        <SummaryCard label="Expense" value={summary.totalExpense} color="rose" />
        <SummaryCard label="Balance" value={summary.balance} color="sky" />
      </div>

      {/* ================= ADD + RECENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddTransaction
          onAdd={() => {
            fetchSummary();
            refreshCharts();
          }}
          editingTx={editingTx}
          clearEdit={() => setEditingTx(null)}
        />

        {/* ================= RECENT TRANSACTIONS ================= */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover-glow">
          <h2 className="text-lg font-bold mb-4 text-gray-200">
            Recent Transactions
          </h2>

          {summary.recentTransactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {summary.recentTransactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex justify-between items-center
                             bg-slate-900 border border-slate-700
                             rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-gray-200">
                      {tx.category}
                      {tx.note && (
                        <span className="text-gray-400 font-normal">
                          {" "}— {tx.note}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={`font-semibold ${
                        tx.type === "income"
                          ? "text-teal-400"
                          : "text-rose-400"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount}
                    </p>

                    <button
                      onClick={() => setEditingTx(tx)}
                      className="text-sky-400"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="text-rose-400"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="mt-10 hover-glow">
        <Charts key={refreshKey} />
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENT ================= */
const SummaryCard = ({ label, value, color }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
    <p className="text-gray-400">{label}</p>
    <p className={`text-${color}-400 text-2xl font-bold`}>
      ₹{value}
    </p>
  </div>
);

export default Dashboard;
