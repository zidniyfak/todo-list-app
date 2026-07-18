(() => {
  "use strict";

  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  };

  let tasks = [];
  let activeTab = "todo";

  function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const todayStr = getTodayDateString();

  function formatDateDisplay(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => htmlEscapes[tag] || tag);
  }

  function loadTasks() {
    const stored = localStorage.getItem("todo-tasks");
    if (stored) {
      tasks = JSON.parse(stored);
    } else {
      tasks = [];
      saveTasks();
    }
  }

  function saveTasks() {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }

  function showToast(message, type = "success") {
    const container = document.querySelector(".toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add("toast--show"), 10);
    
    setTimeout(() => {
      toast.classList.remove("toast--show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  const modal = document.getElementById("confirm-modal");
  const modalMessage = modal.querySelector(".modal__message");
  const confirmBtn = modal.querySelector(".modal__btn--confirm");
  const cancelBtn = modal.querySelector(".modal__btn--cancel");
  const backdrop = modal.querySelector(".modal__backdrop");
  let modalAction = null;

  function openModal(message, action) {
    modalMessage.textContent = message;
    modalAction = action;
    modal.removeAttribute("hidden");
  }

  function closeModal() {
    modal.setAttribute("hidden", "");
    modalAction = null;
  }

  cancelBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  confirmBtn.addEventListener("click", () => {
    if (modalAction) modalAction();
    closeModal();
  });

  const taskItemsContainer = document.querySelector(".task-list__items");
  const navButtons = document.querySelectorAll(".task-nav__link");

  function render() {
    const todoCount = tasks.filter(t => !t.completed).length;
    const doneCount = tasks.filter(t => t.completed).length;
    const overdueCount = tasks.filter(t => !t.completed && t.dueDate < todayStr).length;

    if (navButtons.length === 3) {
      navButtons[0].querySelector(".task-nav__count").textContent = todoCount;
      navButtons[1].querySelector(".task-nav__count").textContent = doneCount;
      navButtons[2].querySelector(".task-nav__count").textContent = overdueCount;

      navButtons.forEach((btn, index) => {
        const tabName = ["todo", "done", "overdue"][index];
        if (tabName === activeTab) {
          btn.classList.add("task-nav__link--active");
          btn.setAttribute("aria-pressed", "true");
          const countBadge = btn.querySelector(".task-nav__count");
          if (countBadge) countBadge.classList.add("task-nav__count--active");
        } else {
          btn.classList.remove("task-nav__link--active");
          btn.setAttribute("aria-pressed", "false");
          const countBadge = btn.querySelector(".task-nav__count");
          if (countBadge) countBadge.classList.remove("task-nav__count--active");
        }
      });
    }

    let filteredTasks = [];
    if (activeTab === "todo") {
      filteredTasks = tasks.filter(t => !t.completed);
    } else if (activeTab === "done") {
      filteredTasks = tasks.filter(t => t.completed);
    } else if (activeTab === "overdue") {
      filteredTasks = tasks.filter(t => !t.completed && t.dueDate < todayStr);
    }

    taskItemsContainer.innerHTML = "";

    if (filteredTasks.length === 0) {
      taskItemsContainer.innerHTML = `<li class="task-item-empty">No tasks in this category</li>`;
      return;
    }

    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item";
      if (task.completed) {
        li.classList.add("task-item--done");
      }
      const isOverdue = !task.completed && task.dueDate < todayStr;
      if (isOverdue) {
        li.classList.add("task-item--overdue");
      }

      li.innerHTML = `
        <input type="checkbox" class="task-item__checkbox" id="task-${task.id}" ${task.completed ? "checked" : ""} />
        <div class="task-item__details">
          <label class="task-item__label" for="task-${task.id}">
            <span class="task-item__priority-dot task-item__priority-dot--${task.priority} ${task.completed ? "task-item__priority-dot--done" : ""}"></span>
            ${escapeHTML(task.title)}
          </label>
          <div class="task-item__meta">
            <time class="task-item__date" datetime="${task.dueDate}">${formatDateDisplay(task.dueDate)}</time>
            ${isOverdue ? `
              <span class="task-item__overdue-badge">
                <svg class="task-item__overdue-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Overdue
              </span>
            ` : ""}
          </div>
        </div>
        <button type="button" class="task-item__delete" aria-label="Delete task">
          <svg class="task-item__delete-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      `;

      const checkbox = li.querySelector(".task-item__checkbox");
      checkbox.addEventListener("change", () => {
        handleTaskToggle(task, checkbox, li);
      });

      const deleteBtn = li.querySelector(".task-item__delete");
      deleteBtn.addEventListener("click", () => {
        handleTaskDelete(task, li);
      });

      taskItemsContainer.appendChild(li);
    });
  }

  function handleTaskToggle(task, checkbox, li) {
    task.completed = checkbox.checked;
    saveTasks();
    
    if (task.completed) {
      showToast("Task marked as completed!", "success");
    } else {
      showToast("Task marked as active!", "info");
    }
    
    li.style.opacity = "0";
    li.style.transform = "translateY(10px)";
    setTimeout(render, 300);
  }

  function handleTaskDelete(task, li) {
    openModal("Are you sure you want to delete this task?", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      li.style.opacity = "0";
      li.style.transform = "translateY(10px)";
      setTimeout(render, 300);
      showToast("Task deleted!", "danger");
    });
  }

  const form = document.querySelector(".task-form");
  const taskInput = document.getElementById("input-task");
  const prioritySelect = document.getElementById("task-priority");
  const dateInput = document.getElementById("task-date");
  const visualLabel = document.querySelector(".task-form__priority-label");
  const visualDot = document.querySelector(".task-form__priority-dot");

  prioritySelect.addEventListener("change", (e) => {
    const val = e.target.value;
    const label = e.target.options[e.target.selectedIndex].text;
    visualLabel.textContent = label;
    visualDot.className = "task-form__priority-dot";
    visualDot.classList.add(`task-form__priority-dot--${val}`);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = taskInput.value.trim();
    if (!title) {
      showToast("Please enter a task description.", "info");
      return;
    }

    const priority = prioritySelect.value || "low";
    const dueDate = dateInput.value || todayStr;

    const newTask = {
      id: Date.now(),
      title: title,
      priority: priority,
      dueDate: dueDate,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    
    showToast("Task added successfully!", "success");
    form.reset();
    
    visualLabel.textContent = "Low";
    visualDot.className = "task-form__priority-dot task-form__priority-dot--low";

    render();
  });

  if (navButtons.length === 3) {
    navButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        activeTab = ["todo", "done", "overdue"][index];
        render();
      });
    });
  }

  const deleteAllBtn = document.querySelector(".task-list__header-delete");
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener("click", () => {
      handleDeleteAll();
    });
  }

  function handleDeleteAll() {
    let visibleTasks = [];
    if (activeTab === "todo") {
      visibleTasks = tasks.filter(t => !t.completed);
    } else if (activeTab === "done") {
      visibleTasks = tasks.filter(t => t.completed);
    } else if (activeTab === "overdue") {
      visibleTasks = tasks.filter(t => !t.completed && t.dueDate < todayStr);
    }

    if (visibleTasks.length === 0) {
      showToast("No tasks available to delete in this tab.", "info");
      return;
    }

    openModal("Are you sure you want to delete all tasks in this tab?", () => {
      const visibleIds = new Set(visibleTasks.map(t => t.id));
      tasks = tasks.filter(t => !visibleIds.has(t.id));
      saveTasks();
      
      const DOMitems = document.querySelectorAll(".task-item");
      DOMitems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(10px)";
      });

      setTimeout(render, 300);
      showToast("All tasks in this tab deleted!", "danger");
    });
  }

  function updateGreetingDate() {
    const greetingDate = document.querySelector(".greeting__date");
    const greetingDay = document.querySelector(".greeting__date-day");
    const greetingFull = document.querySelector(".greeting__date-full");

    if (greetingDate && greetingDay && greetingFull) {
      const today = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      greetingDate.setAttribute("datetime", todayStr);
      greetingDay.textContent = days[today.getDay()];
      greetingFull.textContent = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    }
  }

  loadTasks();
  updateGreetingDate();
  render();
})();
