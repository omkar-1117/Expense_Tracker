import { useEffect, useMemo, useState } from "react";
import { getExpenses, createExpense, deleteExpense } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import { ChartCard } from "../components/ChartCard";

const thisMonthTotal = (expenses) => {
  const month = new Date().getMonth();
  return expenses
    .filter((exp) => exp.date && new Date(exp.date).getMonth() === month)
    .reduce((sum, exp) => sum + Number(exp.amount), 0);
};

export default function DashboardPage() {
  const { logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await getExpenses();
      setExpenses(res.data);
    } catch {
      setError("Error loading expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (payload) => {
    setAdding(true); setError("");
    try {
      await createExpense(payload);
      await load();
    } catch {
      setError("Error adding expense.");
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id) => {
    setDeletingId(id); setError("");
    try {
      await deleteExpense(id);
      await load();
    } catch {
      setError("Error deleting expense.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filter === "All" ? expenses : expenses.filter((e) => e.category === filter);

  const total = useMemo(() => expenses.reduce((sum, exp) => sum + Number(exp.amount), 0), [expenses]);
  const monthlyTotal = useMemo(() => thisMonthTotal(expenses), [expenses]);

  const pieData = useMemo(() => {
    const map = {};
    filtered.forEach((e) => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return { labels: Object.keys(map), datasets: [{ data: Object.values(map), backgroundColor: ["#2563EB","#10B981","#F59E0B"] }] };
  }, [filtered]);

  const lineData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { if (e.date) map[new Date(e.date).getDate()] = (map[new Date(e.date).getDate()] || 0) + Number(e.amount); });
    const days = Object.keys(map).sort((a,b) => a - b);
    return { labels: days, datasets: [{ label: "Daily", data: days.map(d => map[d]), borderColor: "#4338CA", backgroundColor: "rgba(67,56,202,0.2)", fill: true, tension: 0.3 }] };
  }, [expenses]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6 lg:p-8">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-3xl font-extrabold">Expense Tracker</h1>
            <p className="text-sm text-slate-500">Monitor spending, categories and trends.</p>
          </div>
          <button onClick={logout} className="btn-danger">Logout</button>
        </div>

        {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>}

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr] mb-4">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Add Expense</h2>
            <ExpenseForm onAdd={add} loading={adding} />
          </div>
          <div className="space-y-4">
            <ExpenseSummary total={total} monthlyTotal={monthlyTotal} />
            <ChartCard chartType="pie" data={pieData} />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="bg-white p-5 rounded-xl shadow-sm"><ChartCard chartType="line" data={lineData} /></div>
          <div className="bg-white p-5 rounded-xl shadow-sm"><ExpenseList expenses={filtered} filter={filter} onFilter={setFilter} onDelete={remove} deletingId={deletingId} /></div>
        </section>

        {loading && <p className="text-center text-gray-500 py-4">Loading expenses...</p>}
      </div>
    </div>
  );
}
