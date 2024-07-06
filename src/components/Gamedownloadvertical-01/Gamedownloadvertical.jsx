import { createSignal, onCleanup, onMount } from "solid-js";
import Chart from "chart.js/auto";
import './Gamedownloadvertical.css';

function Gameverticaldownloadslide({ isActive }) {
    const [gameInfo, setGameInfo] = createSignal(null);
    const [loading, setLoading] = createSignal(true);

    let downloadUploadChart;
    let bytesChart;

    const fetchStats = async () => {
        try {
            const stats = JSON.parse(localStorage.getItem('CDG_Stats'));
            
            setGameInfo(stats);
            setLoading(false);
            updateCharts(stats);
        } catch (error) {
            console.error('Error fetching torrent stats:', error);
        }
    };

    const updateCharts = (stats) => {
        if (downloadUploadChart && bytesChart) {
            const mbDownloadSpeed = (stats.download_speed || 0) ;
            const mbUploadSpeed = (stats.upload_speed || 0) ;
            const downloadedMB = (stats.progress_bytes || 0) / (1024 * 1024);
            const uploadedMB = (stats.uploaded_bytes || 0) / (1024 * 1024);

            downloadUploadChart.data.datasets[0].data.push(mbDownloadSpeed.toFixed(2));
            downloadUploadChart.data.datasets[1].data.push(mbUploadSpeed.toFixed(2));
            bytesChart.data.datasets[0].data.push(downloadedMB.toFixed(2));
            bytesChart.data.datasets[1].data.push(uploadedMB.toFixed(2));

            const currentTime = new Date().toLocaleTimeString();
            downloadUploadChart.data.labels.push(currentTime);
            bytesChart.data.labels.push(currentTime);


            downloadUploadChart.update();
            bytesChart.update();
        }
    };

    onMount(() => {
        fetchStats();
        const intervalId = setInterval(fetchStats, 500);
        onCleanup(() => clearInterval(intervalId));

        // Initialize charts
        const ctx1 = document.getElementById('downloadUploadChart').getContext('2d');
        downloadUploadChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Download Speed (MB/s)',
                        data: [],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false
                    },
                    {
                        label: 'Upload Speed (MB/s)',
                        data: [],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Speed (MB/s)'
                        }
                    }
                }
            }
        });

        const ctx2 = document.getElementById('bytesChart').getContext('2d');
        bytesChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Downloaded MB',
                        data: [],
                        borderColor: 'rgba(144, 238, 144, 1)',
                        backgroundColor: 'rgba(144, 238, 144, 0.2)',
                        fill: false
                    },
                    {
                        label: 'Uploaded MB',
                        data: [],
                        borderColor: 'rgba(221, 160, 221, 1)',
                        backgroundColor: 'rgba(221, 160, 221, 0.2)',
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Megabytes (MB)'
                        }
                    }
                }
            }
        });
    });

    return (
        <div class="sidebar-space" style={{ display: isActive ? 'block' : 'none' }}>
            <div class="stats-panel">
                <h2>Game Download Progress</h2>
                <div class="progress-bar">
                    <div class="progress" style={{ width: `${gameInfo()?.progress_bytes / gameInfo()?.total_bytes * 100}%` }}></div>
                </div>
                <canvas id="downloadUploadChart"></canvas>
                <canvas id="bytesChart"></canvas>
            </div>
        </div>
    );
}

export default Gameverticaldownloadslide;
