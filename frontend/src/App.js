import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRouter() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(`${BASE_URL}/token/`, {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access);
      setToken(res.data.access);
    } catch {
      setError("Invalid credentials");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post(`${BASE_URL}/register/`, {
        username,
        password,
      });

      alert("Registration successful. Please login.");
      setIsRegister(false);
    } catch {
      setError("Registration failed");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername("");
    setPassword("");
  };

  // FETCH
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/expenses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  }, [token, BASE_URL]);

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token, fetchExpenses]);

  // ADD
  const addExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/expenses/`,
        {
          title,
          amount: Number(amount),
          category,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setAmount("");
      setDate("");
      fetchExpenses();
    } catch {
      setError("Add failed");
    }
  };

  // DELETE
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/expenses/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchExpenses();
    } catch {
      setError("Delete failed");
    }
  };

  // TOTAL
  const total = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [expenses]);

  // MONTHLY TOTAL
  const monthlyTotal = useMemo(() => {
    const currentMonth = new Date().getMonth();

    return expenses
      .filter(
        (exp) =>
          exp.date &&
          new Date(exp.date).getMonth() === currentMonth
      )
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [expenses]);

  // FILTER
  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((exp) => exp.category === filter);

  // PIE CHART
  const chartData = useMemo(() => {
    const data = {};
    expenses.forEach((exp) => {
      data[exp.category] =
        (data[exp.category] || 0) + Number(exp.amount);
    });

    return {
      labels: Object.keys(data),
      datasets: [{ data: Object.values(data) }],
    };
  }, [expenses]);

  // LINE CHART
  const lineData = useMemo(() => {
    const dailyData = {};

    expenses.forEach((exp) => {
      if (!exp.date) return;

      const day = new Date(exp.date).getDate();
      dailyData[day] = (dailyData[day] || 0) + Number(exp.amount);
    });

    const sortedDays = Object.keys(dailyData).sort((a, b) => a - b);

    return {
      labels: sortedDays,
      datasets: [
        {
          label: "Daily Expenses",
          data: sortedDays.map((day) => dailyData[day]),
          borderColor: "#2563EB",
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [expenses]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ₹${context.formattedValue}`,
        },
      },
    },
    cutout: "30%",
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isRegister ? "Register" : "Login"}
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <br />

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="w-full text-blue-600 hover:text-blue-800 transition duration-200"
          >
            {isRegister
              ? "Already have account? Login"
              : "Create new account"}
          </button>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Expense Tracker</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>

        {error && (
          <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Expense</h3>
          <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="md:col-span-2 lg:col-span-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Add Expense
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-gray-800">Total Expenses</h3>
            <p className="text-3xl text-blue-600 font-semibold">₹{total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-gray-800">This Month</h3>
            <p className="text-3xl text-green-600 font-semibold">₹{monthlyTotal}</p>
          </div>
        </div>

        {expenses.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Category Breakdown</h3>
                <div className="w-full max-w-[220px] h-56 mx-auto">
                  <Pie data={chartData} options={pieOptions} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily Trend</h3>
                <div className="w-full">
                  <Line data={lineData} />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Expenses</h3>
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
            </select>
          </div>

          <div className="space-y-2">
            {filteredExpenses.map((exp) => (
              <div key={exp.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800">{exp.title}</span> - 
                  <span className="text-green-600 font-semibold"> ₹{exp.amount}</span> 
                  <span className="text-gray-500"> ({exp.category})</span> - 
                  <span className="text-gray-500">{exp.date}</span>
                </div>
                <button
                  onClick={() => deleteExpense(exp.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;