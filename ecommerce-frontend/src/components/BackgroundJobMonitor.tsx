import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

type Job = {
    jobId: number;
    orderId: number;
    jobType: string;
    status: string;
    message: string;
    updatedAt: string;
};

const API_URL = import.meta.env.VITE_API_URL as string;
const WS_URL = API_URL.replace(/^http/, "ws") + "/ws-smartcart";

function BackgroundJobMonitor() {

    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        // 1. Load existing jobs through REST
        fetch(`${API_URL}/api/jobs`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setJobs)
            .catch(console.error);

        // 2. Listen for live updates through WebSocket
        const client = new Client({
            brokerURL: WS_URL,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe("/topic/jobs", message => {
                    const updatedJob: Job = JSON.parse(message.body);

                    setJobs(old => {
                        const exists = old.some(
                            job => job.jobId === updatedJob.jobId
                        );

                        return exists
                            ? old.map(job =>
                                job.jobId === updatedJob.jobId
                                    ? updatedJob : job
                              )
                            : [updatedJob, ...old];
                    });
                });
            }
        });

        client.activate();

        return () => { client.deactivate(); };

    }, []);

    return (
        <div className="job-monitor">
            <h2>Background Job Monitor</h2>

            <table>
                <thead>
                    <tr>
                        <th>Job ID</th>
                        <th>Order ID</th>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Message</th>
                    </tr>
                </thead>

                <tbody>
                    {jobs.map(job => (
                        <tr key={job.jobId}>
                            <td>{job.jobId}</td>
                            <td>{job.orderId}</td>
                            <td>{job.jobType}</td>
                            <td className={job.status.toLowerCase()}>
                                {job.status}
                            </td>
                            <td>{job.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BackgroundJobMonitor;