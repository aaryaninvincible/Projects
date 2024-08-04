import React, { useState } from 'react';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');

    const handleAddTask = () => {
        const trimmedText = taskText.trim();
        if (trimmedText === '') {
            alert('Please enter a task.');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: trimmedText,
            completed: false
        };

        setTasks([...tasks, newTask]);
        setTaskText('');
    };

    const completeTask = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
        );
        setTasks(updatedTasks);
    };

    const editTask = (taskId, newText) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, text: newText } : task
        );
        setTasks(updatedTasks);
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-md">
                <input
                    id="taskInput"
                    type="text"
                    className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter task..."
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                />
                <button
                    id="addTaskButton"
                    className="w-full px-4 py-2 mb-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={handleAddTask}
                >
                    Add Task
                </button>

                <ul id="pendingTasksList" className="list-none p-0">
                    {tasks.map(task => (
                        <li key={task.id} className={`flex items-center justify-between p-4 mb-2 rounded-md ${task.completed ? 'bg-gray-700' : 'bg-gray-800'}`}>
                            <span className={`${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                            <div className="flex space-x-2">
                                {!task.completed && (
                                    <button
                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        onClick={() => completeTask(task.id)}
                                    >
                                        Complete
                                    </button>
                                )}
                                {!task.completed && (
                                    <button
                                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        onClick={() => editTask(task.id, prompt('Edit task', task.text))}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskManager;
