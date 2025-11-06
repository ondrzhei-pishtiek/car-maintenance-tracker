const taskInput = document.getElementById("taskInput");
const mileageInput = document.getElementById("mileageInput");
const dateInput = document.getElementById("dateInput");
const vehicleSelector = document.getElementById("vehicleSelector");
const taskTable = document.getElementById("taskTable");

const statTotal = document.getElementById("statTotal");
const statGolf = document.getElementById("statGolf");
const statX5 = document.getElementById("statX5");
const statAvg = document.getElementById("statAvg");
const statLast = document.getElementById("statLast");

let filterMileage = document.getElementById("filterMileage");

let tasks = JSON.parse(localStorage.getItem("vehicleTasks")) || [];


function renderTable(list = tasks) {
    taskTable.innerHTML = "";

    list.forEach((task, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.vehicle}</td>
            <td>${task.text}</td>
            <td>${task.mileage} km</td>
            <td>${task.date}</td>
            <td><button class="delete-btn" onclick="deleteTask(${index})">Delete</button></td>
        `;

        taskTable.appendChild(row);
    });

    updateStats();
}

function addTask() {
    const text = taskInput.value.trim();
    const mileage = mileageInput.value.trim();
    const date = dateInput.value.trim();
    const vehicle = vehicleSelector.value;

    if (!text || !mileage || !date) {
        alert("Fill all fields!");
        return;
    }

    const taskObj = {
        text,
        mileage: Number(mileage),
        date,
        vehicle
    };

    tasks.push(taskObj);
    save();

    taskInput.value = "";
    mileageInput.value = "";
    dateInput.value = "";

    renderTable();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    save();
    renderTable();
}

function save() {
    localStorage.setItem("vehicleTasks", JSON.stringify(tasks));
}

function updateStats() {
    statTotal.textContent = tasks.length;

    statGolf.textContent = tasks.filter(t => t.vehicle === "golf5").length;
    statX5.textContent = tasks.filter(t => t.vehicle === "x5").length;

    if (tasks.length > 0) {
        statAvg.textContent = Math.round(tasks.reduce((a, b) => a + b.mileage, 0) / tasks.length);
        statLast.textContent = tasks[tasks.length - 1].text;
    } else {
        statAvg.textContent = 0;
        statLast.textContent = "—";
    }
}

document.getElementById("addBtn").onclick = addTask;

document.getElementById("filterBtn").onclick = () => {
    const maxM = Number(filterMileage.value);
    if (!maxM) return renderTable();

    const filtered = tasks.filter(t => t.mileage <= maxM);
    renderTable(filtered);
};

document.getElementById("resetFilterBtn").onclick = () => {
    filterMileage.value = "";
    renderTable();
};

document.getElementById("clearAll").onclick = () => {
    if (confirm("Are you sure?")) {
        tasks = [];
        save();
        renderTable();
    }
};

renderTable();
