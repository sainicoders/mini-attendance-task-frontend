import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Attendance from "../components/Attendance";
import Tasks from "../components/Tasks";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("attendance");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-300 p-6">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Employee Dashboard
          </h2>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-5 py-2 rounded-lg transition font-medium ${
              activeTab === "attendance"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Attendance
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-5 py-2 rounded-lg transition font-medium ${
              activeTab === "tasks"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Tasks
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          {activeTab === "attendance" && <Attendance />}
          {activeTab === "tasks" && <Tasks />}
        </div>

      </div>
    </div>
  );
}