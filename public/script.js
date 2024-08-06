const socket = io();

document.getElementById('apiForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const host = document.getElementById('host').value;
    const port = document.getElementById('port').value;
    const time = document.getElementById('time').value;
    const method = document.getElementById('method').value;
    const concurrents = document.getElementById('concurrents').value;

    await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port, time, method, concurrents })
    });
});

document.getElementById('stopButton').addEventListener('click', async () => {
    await fetch('/api/stop', {
        method: 'POST'
    });
    document.querySelector('.status-update').innerText = 'All attacks stopped';
    document.getElementById('statusTableBody').innerHTML = ''; 
});

socket.on('status', (data) => {
    document.querySelector('.status-update').innerText = `Current repetition: ${data.currentRepetition} / ${data.totalRepetitions}`;
    updateStatusTable();
});



async function updateStatus() {
    const response = await fetch('/api/status');
    const data = await response.json();

    if (data.status === 200) {
        const tableBody = document.getElementById('statusTableBody');
        tableBody.innerHTML = '';

        data.attacks.forEach(attack => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${attack.target}</td>
                <td>${attack.method}</td>
                <td class="expire">${attack.expire}</td>
            `;
            tableBody.appendChild(row);
        });

       
    }
}

setInterval(updateStatus, 1000); 
updateStatus();