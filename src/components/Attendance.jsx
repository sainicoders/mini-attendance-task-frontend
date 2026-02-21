import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await API.get("/attendance");
      setRecords(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      await API.post("/attendance/check-in");
      toast.success("Checked in successfully");
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await API.post("/attendance/check-out");
      toast.success("Checked out successfully");
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-out failed");
    }
  };

return (
  <div className="text-gray-800">

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
      <button
        onClick={handleCheckIn}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
      >
        Check In
      </button>

      <button
        onClick={handleCheckOut}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
      >
        Check Out
      </button>
    </div>

    {/* Loading / Empty */}
    {loading ? (
      <p className="text-center text-gray-500">Loading...</p>
    ) : records.length === 0 ? (
      <p className="text-center text-gray-500">No attendance records</p>
    ) : (
      <>
        {/* ✅ Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Check In</th>
                <th className="p-4">Check Out</th>
                <th className="p-4">Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-700">
                    {item.date}
                  </td>
                  <td className="p-4 text-gray-600">
                    {item.check_in_time
                      ? new Date(item.check_in_time).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {item.check_out_time
                      ? new Date(item.check_out_time).toLocaleTimeString()
                      : "-"}
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                    {item.working_hours
                      ? `${item.working_hours} hrs`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {records.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Date</span>
                <span className="font-medium text-gray-700">
                  {item.date}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Check In</span>
                <span className="text-gray-600">
                  {item.check_in_time
                    ? new Date(item.check_in_time).toLocaleTimeString()
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Check Out</span>
                <span className="text-gray-600">
                  {item.check_out_time
                    ? new Date(item.check_out_time).toLocaleTimeString()
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Working Hours</span>
                <span className="font-medium text-gray-700">
                  {item.working_hours
                    ? `${item.working_hours} hrs`
                    : "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);
}