// Task array to store tasks
let tasks = [];

// Load tasks from localStorage on page load
window.onload = function() {
    loadTasks();
    updateDashboard();
    checkReminder();
};

// Add a new task
function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskDueDate = document.getElementById('task-due-date').value;

    if (!taskName) {
        alert('Task name is required!');
        return;
    }

    const newTask = {
        id: Date.now(),
        name: taskName,
        priority: taskPriority,
        dueDate: taskDueDate,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateDashboard();
}

document.getElementById('add-task').addEventListener('click', addTask);

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateDashboard();
}

// Toggle task completion
function toggleComplete(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateDashboard();
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

// Render tasks to the DOM
function renderTasks(filter = 'all') {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
    });

    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;

        taskCard.innerHTML = `
            <span class="task-name">${task.name}</span>
            <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
            <span class="task-due-date">${task.dueDate || 'No due date'}</span>
            <button onclick="toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        taskList.appendChild(taskCard);
    });
}

// Update dashboard metrics
function updateDashboard() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const productivityScore = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
    document.getElementById('productivity-score').textContent = `${productivityScore}%`;
}

// Check for reminders
function checkReminder() {
    const today = new Date().toISOString().split('T')[0];
    const dueToday = tasks.filter(task => task.dueDate === today && !task.completed);

    if (dueToday.length > 0) {
        alert(`You have ${dueToday.length} task(s) due today!`);
    }
}