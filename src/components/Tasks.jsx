import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
const [expandedId, setExpandedId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data.data || res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setIsOpen(true);
  };

  const openEditModal = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      if (editId) {
        await API.patch(`/tasks/${editId}`, { title, description });
        toast.success("Task updated");
      } else {
        await API.post("/tasks", { title, description });
        toast.success("Task created");
      }

      setIsOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const completeTask = async (id) => {
    try {
      await API.patch(`/tasks/${id}`, { status: "completed" });
      toast.success("Task completed");
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

return (
 
  <div className="text-gray-800">

    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
      <h3 className="text-xl font-semibold text-gray-700">My Tasks</h3>

      <button
        onClick={openAddModal}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto"
      >
        + Add Task
      </button>
    </div>

    {loading ? (
      <p className="text-center text-gray-500">Loading...</p>
    ) : tasks.length === 0 ? (
      <p className="text-center text-gray-500">No tasks available</p>
    ) : (
      <>
        {/* ✅ Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-700">
                    {task.title}
                  </td>

                  <td className="p-4 max-w-sm text-gray-600">
                    {task.description ? (
                      <>
                        <p
                          className={`whitespace-pre-wrap break-words ${
                            expandedId === task.id ? "" : "line-clamp-2"
                          }`}
                        >
                          {task.description}
                        </p>

                        {task.description.length > 80 && (
                          <button
                            onClick={() =>
                              setExpandedId(
                                expandedId === task.id ? null : task.id
                              )
                            }
                            className="text-blue-500 text-xs mt-1 hover:underline"
                          >
                            {expandedId === task.id
                              ? "Read Less"
                              : "Read More"}
                          </button>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(task)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded-md transition"
                      >
                        Edit
                      </button>

                      {task.status === "pending" && (
                        <button
                          onClick={() => completeTask(task.id)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="mb-2">
                <h4 className="font-semibold text-gray-700">
                  {task.title}
                </h4>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {task.description ? (
                  <>
                    <p
                      className={`whitespace-pre-wrap break-words ${
                        expandedId === task.id ? "" : "line-clamp-3"
                      }`}
                    >
                      {task.description}
                    </p>

                    {task.description.length > 80 && (
                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === task.id ? null : task.id
                          )
                        }
                        className="text-blue-500 text-xs mt-1 hover:underline"
                      >
                        {expandedId === task.id
                          ? "Read Less"
                          : "Read More"}
                      </button>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </div>

              <div className="flex justify-between items-center mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(task)}
                  className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-md transition"
                >
                  Edit
                </button>

                {task.status === "pending" && (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    )}

 {isOpen && (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">

    <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {editId ? "Edit Task" : "Add Task"}
          </h3>

          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
)}
  </div>
);

 
}