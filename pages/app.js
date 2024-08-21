const API_URL = 'http://localhost:3000/entries';

document.getElementById('add-entry').addEventListener('click', addEntry);

async function addEntry() {
    const mood = document.getElementById('mood').value;
    const journal = document.getElementById('journal').value;

    if (journal) {
        const entry = { mood, journal };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });

        const newEntry = await response.json();
        renderEntry(newEntry);
        document.getElementById('journal').value = '';
    }
}

async function fetchEntries() {
    const response = await fetch(API_URL);
    const entries = await response.json();
    entries.forEach(renderEntry);
}

function renderEntry(entry) {
    const entryList = document.getElementById('entry-list');
    const li = document.createElement('li');
    li.classList.add('entry-item');

    const formattedDate = new Date(entry.date).toLocaleDateString(); 

    li.innerHTML = `
        <div class="entry-content">
            <span class="mood">${getMoodIcon(entry.mood)} ${entry.mood}</span>
            <p class="journal">${entry.journal}</p>
            <span class="date">${formattedDate}</span>
        </div>
        <button class="delete-btn" onclick="deleteEntry('${entry._id}')">Delete</button>
    `;

    entryList.appendChild(li);
}

function getMoodIcon(mood) {
    switch (mood) {
        case 'happy': return '😊';
        case 'sad': return '😢';
        case 'neutral': return '😐';
        case 'angry': return '😡';
        case 'excited': return '😃';
        default: return '';
    }
}

async function deleteEntry(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const entryList = document.getElementById('entry-list');
    entryList.innerHTML = '';
    fetchEntries();
}

fetchEntries();
