document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const taskItem = createTaskItem(taskText);
    document.getElementById('pendingTasksList').appendChild(taskItem);
    taskInput.value = '';
});

function createTaskItem(taskText) {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;
    taskItem.appendChild(taskContent);

    const actionButtons = document.createElement('div');

    const completeButton = document.createElement('button');
    completeButton.className = 'btn btn-success';
    completeButton.textContent = 'Complete';
    completeButton.addEventListener('click', function() {
        completeTask(taskItem);
    });

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-warning';
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
        taskItem.replaceChild(taskContent, editInput);
        saveButton.remove();
    });

    taskItem.replaceChild(editInput, taskContent);
    taskItem.appendChild(saveButton);
}

function deleteTask(taskItem) {
    taskItem.remove();
}
