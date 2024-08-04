document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    // Check if task text is empty
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    // Check if the task already exists
    const existingTasks = document.querySelectorAll('.task-text');
    for (let i = 0; i < existingTasks.length; i++) {
        if (existingTasks[i].textContent === taskText) {
            alert('Task already exists.');
            return;
        }
    }

    const hashtags = document.getElementById('hashtagsInput').value.split(',');
    const today = document.getElementById('todayTask').checked;
    const tomorrow = document.getElementById('tomorrowTask').checked;

    // Logic to categorize tasks based on checkboxes and hashtags
    let taskList;
    if (today) {
        taskList = document.getElementById('pendingTasksListToday');
    } else if (tomorrow) {
        taskList = document.getElementById('pendingTasksListTomorrow');
    } else {
        taskList = document.getElementById('pendingTasksListUpcoming');
    }

    const taskItem = createTaskItem(taskText, hashtags);
    taskList.appendChild(taskItem);

    // Clear input fields after adding task
    taskInput.value = '';
    document.getElementById('hashtagsInput').value = '';
});

function createTaskItem(taskText, hashtags) {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    const taskContent = document.createElement('span');
    taskContent.className = 'task-text';
    taskContent.textContent = taskText;
    taskItem.appendChild(taskContent);

    const hashtagSpan = document.createElement('span');
    hashtagSpan.className = 'ml-2';
    if (hashtags.length > 0) {
        hashtagSpan.textContent = 'Tags: ' + hashtags.join(', ');
    }
    taskItem.appendChild(hashtagSpan);

    const actionButtons = document.createElement('div');

    const completeButton = document.createElement('button');
    completeButton.className = 'btn btn-success mr-2';
    completeButton.textContent = 'Complete';
    completeButton.addEventListener('click', function() {
        completeTask(taskItem);
    });

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-warning mr-2';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        editTask(taskItem, taskContent);
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        deleteTask(taskItem);
    });

    actionButtons.appendChild(completeButton);
    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);
    taskItem.appendChild(actionButtons);

    return taskItem;
}

function completeTask(taskItem) {
    taskItem.classList.add('completed');
    taskItem.querySelector('.btn-success').remove();
    taskItem.querySelector('.btn-warning').style.display = 'none';
    document.getElementById('completedTasksList').appendChild(taskItem);
}

function editTask(taskItem, taskContent) {
    const editInput = document.createElement('input');
    editInput.type = 'text';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
     editInput.className = 'form-control';
    editInput.value = taskContent.textContent;

    const saveButton = document.createElement('button');
    saveButton.className = 'btn btn-primary';
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', function() {
        taskContent.textContent = editInput.value.trim();
        taskItem.classList.remove('editing');
        taskItem.replaceChild(taskContent, editInput);
        saveButton.remove();
    });

    taskItem.classList.add('editing');
    taskItem.replaceChild(editInput, taskContent);
    taskItem.appendChild(saveButton);
}


function deleteTask(taskItem) {
    taskItem.remove();
}
