import { useState } from "react";

const categories = ["Food", "Travel", "Shopping"];

export default function ExpenseForm({ onAdd, loading }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, amount: Number(amount), category, date });
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
      <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input className="input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required min="0" step="0.01" />
      <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (<option key={cat}>{cat}</option>))}
      </select>
      <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <button type="submit" className="btn-primary md:col-span-2" disabled={loading}>{loading ? "Adding..." : "Add Expense"}</button>
    </form>
  );
}
