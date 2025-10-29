import { useEffect, useState } from "react";

export default function ItemEntry() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [itemType, setItemType] = useState("Ring");
  const [pieces, setPieces] = useState("1");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(stored);
  }, []);

  const addItem = (e) => {
    e.preventDefault();
    if (!jobId) { alert("Select job"); return; }
    const updated = jobs.map(job => {
      if (job.jobId === jobId) {
        const rec = { id: Date.now(), itemType, pieces: parseInt(pieces) || 1, totalWeight: parseFloat(weight) || 0 };
        return { ...job, items: [...(job.items || []), rec] };
      }
      return job;
    });
    setJobs(updated);
    localStorage.setItem("jobs", JSON.stringify(updated));
    setItemType("Ring"); setPieces("1"); setWeight("");
    alert("Item added");
  };

  const allItems = jobs.flatMap(job => (job.items || []).map(i => ({ ...i, jobId: job.jobId, customerName: job.customerName })));
  const selectedJob = jobs.find(j => j.jobId === jobId);
  const displayed = jobId ? (selectedJob?.items || []).map(i => ({ ...i, jobId: selectedJob.jobId, customerName: selectedJob.customerName })) : allItems;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Item Entry</h2>

      <form onSubmit={addItem} className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select value={jobId} onChange={e => setJobId(e.target.value)} className="border p-2 rounded">
          <option value="">All Jobs (View Only)</option>
          {jobs.map(j => <option key={j.jobId} value={j.jobId}>{j.jobId} — {j.customerName}</option>)}
        </select>

        <select value={itemType} onChange={e => setItemType(e.target.value)} className="border p-2 rounded" disabled={!jobId}>
          <option>Ring</option><option>Chain</option><option>Bracelet</option><option>Earring</option><option>Pendant</option><option>Bangle</option><option>Other</option>
        </select>

        <input value={pieces} onChange={e => setPieces(e.target.value)} placeholder="Pieces" className="border p-2 rounded" disabled={!jobId} />
        <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="Total Weight (g)" className="border p-2 rounded" disabled={!jobId} />
        <button className={`px-4 py-2 rounded text-white ${jobId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"}`} disabled={!jobId}>Add Item</button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2 text-yellow-700">{jobId ? `Items for ${jobId}` : "All Items (All Jobs)"}</h3>
        {displayed.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-yellow-100 text-left">
              <tr>
                <th className="p-2">Job</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Type</th>
                <th className="p-2">Pieces</th>
                <th className="p-2">Weight</th>
              </tr>
            </thead>
            <tbody>{displayed.map(i => (<tr key={i.id} className="border-t"><td className="p-2">{i.jobId}</td><td className="p-2">{i.customerName}</td><td className="p-2">{i.itemType}</td><td className="p-2">{i.pieces}</td><td className="p-2">{i.totalWeight}</td></tr>))}</tbody>
          </table>
        ) : <p className="text-gray-500">No items found.</p>}
      </div>
    </div>
  );
}
