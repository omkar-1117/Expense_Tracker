export default function ExpenseSummary({ total, monthlyTotal }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-3xl font-bold text-blue-600">₹{total}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">This Month</p>
        <p className="text-3xl font-bold text-emerald-600">₹{monthlyTotal}</p>
      </div>
    </div>
  );
}
