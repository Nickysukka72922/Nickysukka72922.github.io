let cloneCount = 0;

// 1. Initialize on load
window.onload = function() {
    const savedData = localStorage.getItem("myStoredTasks");
    const savedTime = localStorage.getItem("lastSavedTime");
    
    if (savedData) {
        const tasks = JSON.parse(savedData);
        // Using a temporary variable to prevent saveAll loop while loading
        tasks.forEach(task => addtask(task.text, task.checked));
    }
    
    if (savedTime) {
        document.getElementById("timestamp").innerText = savedTime;
    }
};

// 2. The Add Function
function addtask(savedText = "", isChecked = false) {
    const original = document.getElementById("task");
    const clone = original.cloneNode(true);
    
    cloneCount++;
    clone.id = "task-" + cloneCount;

    const textInput = clone.querySelector('input[type="text"]');
    const checkbox = clone.querySelector('input[type="checkbox"]');

    textInput.value = savedText;
    checkbox.checked = isChecked;

    document.getElementById("task-container").appendChild(clone);
    clone.classList.add("show");
    
    saveAll();
}

// 3. The Delete Function (Fixed Reference)
function deleteTask() {
    if (cloneCount > 0) {
        const lastClone = document.getElementById("task-" + cloneCount);
        if (lastClone) {
            lastClone.remove();
            cloneCount--;
            saveAll();
        }
    }
}

// 4. The Clear Function
function clearTask() {
    if (confirm("Delete everything?")) {
        const container = document.getElementById("task-container");
        container.replaceChildren();
        cloneCount = 0;
        saveAll();
    }
}

// 5. The Save Logic
function saveAll() {
    const container = document.getElementById("task-container");
    const allClones = container.querySelectorAll('[id^="task-"]');
    const dataToSave = [];

    allClones.forEach(clone => {
        dataToSave.push({
            text: clone.querySelector('input[type="text"]').value,
            checked: clone.querySelector('input[type="checkbox"]').checked
        });
    });

    localStorage.setItem("myStoredTasks", JSON.stringify(dataToSave));

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const timestampElement = document.getElementById("timestamp");
    if (timestampElement) {
        timestampElement.innerText = timeString;
        localStorage.setItem("lastSavedTime", timeString);
    }
}

// 6. Listeners for Auto-Save
document.getElementById("task-container").addEventListener('input', saveAll);
document.getElementById("task-container").addEventListener('change', saveAll);
