// Simple interactivity: Toggle comments
function toggleComments(element) {
  const comments = element.nextElementSibling;
  if (comments.style.display === "none" || comments.style.display === "") {
    comments.style.display = "block";
    element.textContent = "Hide Comments";
  } else {
    comments.style.display = "none";
    element.textContent = "Show Comments";
  }
}

// Basic navigation (client-side, no page reload)
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute("href").substring(1);
    document.querySelectorAll(".container section").forEach((section) => {
      section.style.display = "none";
    });
    document.getElementById(targetId).style.display = "block";
  });
});

// Show home by default
document.getElementById("home").style.display = "block";

// Dark Mode
const toggleButton = document.getElementById("dark-mode-toggle");
const body = document.body;

// Load saved mode after declaring body
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "enabled") {
  body.classList.add("dark-mode");
}

toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode"); // Adds/removes the class
  const isDark = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  toggleButton.innerHTML = isDark ? "☀" : "🌙"; // Switch icon
});

// Fetch Dogecoin price from CoinGecko API
function updateDogePrice() {
  const apiUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("API request failed");
      }
      return response.json();
    })
    .then((data) => {
      const price = data.dogecoin.usd;
      document.getElementById(
        "last-updated"
      ).textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
      console.log(price.toFixed(4)); // Log price to console
      document.getElementById("doge-price").textContent = price
        ? `Dogecoin Price: $${price.toFixed(4)}`
        : `Dogecoin Price: Not available`;
    })
    .catch((error) => {
      console.error("Error fetching price:", error);
      document.getElementById(
        "doge-price"
      ).textContent = `Dogecoin Price: Error loading`;
    });
}

// Fetch random Dogecoin meme from an API
const memeButton = document.getElementById("random-meme-btn");
const memeTitle = document.getElementById("meme-title");
const memeImage = document.getElementById("meme-image");

function getRandomMeme() {
  const apiUrl = "https://meme-api.com/gimme/dogecoin";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("API request failed");
      }
      return response.json();
    })
    .then((data) => {
      memeTitle.textContent = data.title || "Untitled Doge Meme";
      memeImage.src = data.url;
      memeImage.style.display = "block"; // Show the image
    })
    .catch((error) => {
      console.error("Error fetching meme:", error);
      memeTitle.textContent = "Error loading meme—try again!";
      memeImage.style.display = "none";
    });
}

// To-Do List functionality
class Task {
  constructor(description) {
    this.description = description;
    this.completed = false;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  getDescription() {
    return this.description;
  }

  isCompleted() {
    return this.completed;
  }
}

class ToDoList {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks'))?.map(
        task => Object.assign(new Task(task.description), task)
    ) || [];
    this.taskListElement = document.getElementById('taskList');
    this.render();
}

  addTask() {
    const input = document.getElementById("taskInput");
    const description = input.value.trim();
    if (description) {
      const task = new Task(description);
      this.tasks.push(task);
      input.value = "";
      this.saveTasks();  // Add this line to save after the change
      this.render();
    }
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.saveTasks();  // Add this line to save after the change
    this.render();
  }

  toggleTask(index) {
    this.tasks[index].toggleComplete();
    this.saveTasks();  // Add this line to save after the change
    this.render();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
}

  render() {
    this.taskListElement.innerHTML = "";
    this.tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.isCompleted() ? "completed" : "";
      li.innerHTML = `
                        ${task.getDescription()}
                        <button onclick="todoList.toggleTask(${index})">Toggle</button>
                        <button onclick="todoList.deleteTask(${index})">Delete</button>
                    `;
      this.taskListElement.appendChild(li);
    });
  }
}

const todoList = new ToDoList();

// Add event listener to the meme button
memeButton.addEventListener("click", getRandomMeme);

updateDogePrice(); // innitiial fetch of dogecoin price from coingecko API

setInterval(updateDogePrice, 30000); // Update every 30 seconds
