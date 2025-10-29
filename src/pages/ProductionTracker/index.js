import { useEffect, useState } from "react";

export default function ProductionTracker() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [stageName, setStageName] = useState("Cutting");
  const [issued, setIssued] = useState("");
  const [received, setReceived] = useState("");
  const LOSS_THRESHOLD_PERCENT = 5;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(stored);
  }, []);

  const addStage = (e) => {
    e.preventDefault();
    if (!jobId) {
      alert("Please select a job.");
      return;
    }
    if (!issued || !received) {
      alert("Please enter issued and received weights.");
      return;
    }
    const issuedVal = parseFloat(issued);
    const receivedVal = parseFloat(received);
    const loss = issuedVal - receivedVal;
    const lossPercent = issuedVal ? (loss / issuedVal) * 100 : 0;

    if (lossPercent > LOSS_THRESHOLD_PERCENT) {
      alert(`Loss ${lossPercent.toFixed(2)}% exceeds threshold ${LOSS_THRESHOLD_PERCENT}%`);
    }

    const updated = jobs.map((job) => {
      if (job.jobId === jobId) {
        const stage = {
          id: Date.now(),
          stage_name: stageName,
          weight_issued: issuedVal,
          weight_received: receivedVal,
          loss: parseFloat(loss.toFixed(3)),
          loss_percent: parseFloat(lossPercent.toFixed(2)),
          performed_at: new Date().toLocaleString(),
        };
        return { ...job, stages: [...(job.stages || []), stage] };
      }
      return job;
    });

    setJobs(updated);
    localStorage.setItem("jobs", JSON.stringify(updated));
    setStageName("Cutting");
    setIssued("");
    setReceived("");
    alert("Production stage saved.");
  };

  const allStages = jobs.flatMap(j => (j.stages || []).map(s => ({ ...s, jobId: j.jobId, customerName: j.customerName })));
  const selectedJob = jobs.find(j => j.jobId === jobId);
  const displayed = jobId ? (selectedJob?.stages || []).map(s => ({ ...s, jobId: selectedJob.jobId, customerName: selectedJob.customerName })) : allStages;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Production Tracker</h2>

      <form onSubmit={addStage} className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select value={jobId} onChange={e => setJobId(e.target.value)} className="border p-2 rounded">
          <option value="">All Jobs (View Only)</option>
          {jobs.map(j => <option key={j.jobId} value={j.jobId}>{j.jobId} — {j.customerName}</option>)}
        </select>

        <select value={stageName} onChange={e => setStageName(e.target.value)} className="border p-2 rounded" disabled={!jobId}>
          <option>Cutting</option><option>Filing</option><option>Setting</option><option>Otec</option><option>Chilai</option><option>EP</option><option>Polishing</option><option>Other</option>
        </select>

        <input value={issued} onChange={e => setIssued(e.target.value)} placeholder="Weight Issued (g)" className="border p-2 rounded" disabled={!jobId} />
        <input value={received} onChange={e => setReceived(e.target.value)} placeholder="Weight Received (g)" className="border p-2 rounded" disabled={!jobId} />
        <button className={`px-4 py-2 rounded text-white ${jobId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"}`} disabled={!jobId}>Save Stage</button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2 text-yellow-700">{jobId ? `Stages for ${jobId}` : "All Production Stages"}</h3>
        {displayed.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-yellow-100 text-left">
              <tr>
                <th className="p-2">Job</th>
                <th className="p-2">Stage</th>
                <th className="p-2">Issued</th>
                <th className="p-2">Received</th>
                <th className="p-2">Loss</th>
                <th className="p-2">Loss %</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.jobId}</td>
                  <td className="p-2">{s.stage_name}</td>
                  <td className="p-2">{s.weight_issued}</td>
                  <td className="p-2">{s.weight_received}</td>
                  <td className="p-2">{s.loss}</td>
                  <td className="p-2">{s.loss_percent}%</td>
                  <td className="p-2">{s.performed_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (<p className="text-gray-500">No production records.</p>)}
      </div>
    </div>
  );
}
