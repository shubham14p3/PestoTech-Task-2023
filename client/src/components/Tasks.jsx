import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "./utils/Loader";
import Tooltip from "./utils/Tooltip";

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
  const [selectedFilterStatus, setSelectedFilterStatus] = useState("All");

  const fetchTasks = useCallback(() => {
    const config = {
      url: "/tasks",
      method: "get",
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data.tasks);
      setAllTasks(data.tasks);
    });
    setSelectedFilterStatus("All");
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const filterStatus = (event) => {
    let filteredTasks = allTasks.filter(
      (task) => task.status === event.target.value
    );
    setSelectedFilterStatus(event.target.value);
    console.log(event.target.value, filteredTasks);
    if (event.target.value === "All") {
      setTasks([...allTasks]);
    } else {
      setTasks([...filteredTasks]);
    }
  };

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">
        {allTasks.length !== 0 && (
          <>
            <h2 className="my-2 ml-2 md:ml-0 text-2xl font-bold text-gray-800">
              Your tasks ({tasks.length})
            </h2>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-semibold text-gray-600 mb-1"
              >
                Status
              </label>
              <select
                onChange={filterStatus}
                value={selectedFilterStatus}
                className={`block w-full mt-2 px-3 py-2 text-gray-600 rounded-md border-2 border-gray-100 focus:border-primary transition outline-none hover:border-gray-300`}
              >
                <option value="All">All</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </>
        )}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {allTasks.length === 0 && tasks.length === 0 ? (
              <div className="w-[600px] h-[300px] flex flex-col items-center justify-center gap-4">
                <span className="text-gray-600">No tasks found</span>
                <Link
                  to="/tasks/add"
                  className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2"
                >
                  + Add new task
                </Link>
              </div>
            ) : tasks.length === 0 ? (
              <div className="w-[600px] h-[300px] flex items-center justify-center gap-4">
                <span className="text-gray-600">No tasks found</span>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={task._id}
                  className="bg-gray-100 my-4 p-4 text-gray-800 rounded-md shadow-md"
                >
                  <div className="flex items-center mb-2">
                    <span className="font-medium">Task #{index + 1}</span>
                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link
                        to={`/tasks/${task._id}`}
                        className="ml-auto mr-2 text-green-600 cursor-pointer"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>
                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(task._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                  <div className="whitespace-pre-line">{task.description}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;
