import { useEffect, useState } from "react";

export default function RawMaterialEntry() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [goldWeight, setGoldWeight] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);
  }, []);

  const addMaterial = (e) => {
    e.preventDefault();
    if (!jobId) {
      alert("Please select a job.");
      return;
    }
    if (!goldWeight) {
      alert("Enter exact gold weight.");
      return;
    }

    const updated = jobs.map((job) => {
      if (job.jobId === jobId) {
        const rec = {
          id: Date.now(),
          goldWeight: parseFloat(goldWeight),
          notes: notes || "Verified",
          createdAt: new Date().toLocaleString(),
        };
        return {
          ...job,
          materials: [...(job.materials || []), rec],
          status: "Ready for Workshop",
        };
      }
      return job;
    });

    setJobs(updated);
    localStorage.setItem("jobs", JSON.stringify(updated));
    setGoldWeight("");
    setNotes("");
    alert("Gold received recorded. Job marked Ready for Workshop.");
  };

  const allMaterials = jobs.flatMap((job) =>
    (job.materials || []).map((m) => ({ ...m, jobId: job.jobId, customerName: job.customerName, jobType: job.jobType }))
  );
  const selectedJob = jobs.find((j) => j.jobId === jobId);
  const displayed = jobId ? (selectedJob?.materials || []).map(m => ({ ...m, jobId: selectedJob.jobId, customerName: selectedJob.customerName, jobType: selectedJob.jobType })) : allMaterials;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Raw Material Entry (Gold Only)</h2>

      <form onSubmit={addMaterial} className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="border p-2 rounded">
          <option value="">All Jobs (View Only)</option>
          {jobs.map((j) => <option key={j.jobId} value={j.jobId}>{j.jobId} — {j.customerName}</option>)}
        </select>

        <input type="number" placeholder="Gold Weight (g)" className="border p-2 rounded" value={goldWeight} onChange={e => setGoldWeight(e.target.value)} disabled={!jobId} />
        <input type="text" placeholder="Verification Notes (optional)" className="border p-2 rounded" value={notes} onChange={e => setNotes(e.target.value)} disabled={!jobId} />
        <button className={`px-4 py-2 rounded text-white ${jobId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"}`} disabled={!jobId}>Record Material</button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2 text-yellow-700">{jobId ? `Materials for ${jobId}` : "All Materials (All Jobs)"}</h3>
        {displayed.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-yellow-100 text-left">
              <tr>
                <th className="p-2">Job</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Job Type</th>
                <th className="p-2">Gold (g)</th>
                <th className="p-2">Notes</th>
                <th className="p-2">Status</th>
                <th className="p-2">Recorded</th>
              </tr></thead>
            <tbody>
              {displayed.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-2">{m.jobId}</td>
                  <td className="p-2">{m.customerName}</td>
                  <td className="p-2">{m.jobType}</td>
                  <td className="p-2">{m.goldWeight}</td>
                  <td className="p-2">{m.notes}</td>
                  <td className="p-2 text-green-700">Ready for Workshop</td>
                  <td className="p-2">{m.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (<p className="text-gray-500">No material records found.</p>)}
      </div>
    </div>
  );
}
