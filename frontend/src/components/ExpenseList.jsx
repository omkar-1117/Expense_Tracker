export default function ExpenseList({ expenses, filter, onFilter, onDelete, deletingId }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Expenses</h3>
        <select value={filter} onChange={(e) => onFilter(e.target.value)} className="input w-36">
          <option>All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
        </select>
      </div>

      {expenses.length === 0 ? (
        <p className="text-sm text-gray-500">No expenses yet</p>
      ) : (
        <div className="space-y-2">
          {expenses.map((exp) => (
            <div key={exp.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div>
                <p className="font-medium">{exp.title}</p>
                <p className="text-sm text-gray-500">₹{exp.amount} · {exp.category} · {exp.date}</p>
              </div>
              <button onClick={() => onDelete(exp.id)} disabled={deletingId === exp.id} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:bg-red-300">
                {deletingId === exp.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
