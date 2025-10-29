import { useEffect, useState } from "react";

export default function StoneEntry() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [stoneName, setStoneName] = useState("Diamond");
  const [stoneType, setStoneType] = useState("");
  const [stoneWeight, setStoneWeight] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(stored);
  }, []);

  const addStone = (e) => {
    e.preventDefault();
    if (!jobId) {
      alert("Select Job first");
      return;
    }

    const updated = jobs.map((job) => {
      if (job.jobId === jobId) {
        const rec = {
          id: Date.now(),
          stoneName,
          stoneType,
          stoneWeight: parseFloat(stoneWeight) || 0,
          addedAt: new Date().toLocaleString(),
        };
        return { ...job, stones: [...(job.stones || []), rec] };
      }
      return job;
    });

    setJobs(updated);
    localStorage.setItem("jobs", JSON.stringify(updated));

    setStoneName("Diamond");
    setStoneType("");
    setStoneWeight("");
    alert("Stone added successfully!");
  };

  const allStones = jobs.flatMap((job) =>
    (job.stones || []).map((s) => ({
      ...s,
      jobId: job.jobId,
      customerName: job.customerName,
    }))
  );

  const selectedJob = jobs.find((j) => j.jobId === jobId);
  const displayed = jobId
    ? (selectedJob?.stones || []).map((s) => ({
        ...s,
        jobId: selectedJob.jobId,
        customerName: selectedJob.customerName,
      }))
    : allStones;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-yellow-700">
        Stone Entry
      </h2>

      <form
        onSubmit={addStone}
        className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3"
      >
        <select
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Jobs (View Only)</option>
          {jobs.map((j) => (
            <option key={j.jobId} value={j.jobId}>
              {j.jobId} — {j.customerName}
            </option>
          ))}
        </select>

        <select
          value={stoneName}
          onChange={(e) => setStoneName(e.target.value)}
          className="border p-2 rounded"
          disabled={!jobId}
        >
          <option>Diamond</option>
          <option>Ruby</option>
          <option>Emerald</option>
          <option>Sapphire</option>
          <option>Topaz</option>
          <option>Other</option>
        </select>

        <input
          value={stoneType}
          onChange={(e) => setStoneType(e.target.value)}
          placeholder="Stone Type"
          className="border p-2 rounded"
          disabled={!jobId}
        />

        <input
          value={stoneWeight}
          onChange={(e) => setStoneWeight(e.target.value)}
          placeholder="Stone Weight (g)"
          className="border p-2 rounded"
          disabled={!jobId}
        />

        <button
          className={`px-4 py-2 rounded text-white ${
            jobId
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!jobId}
        >
          Add Stone
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2 text-yellow-700">
          {jobId ? `Stones for ${jobId}` : "All Stones (All Jobs)"}
        </h3>

        {displayed.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-yellow-100 text-left">
              <tr>
                <th className="p-2">Job</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Stone</th>
                <th className="p-2">Type</th>
                <th className="p-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.jobId}</td>
                  <td className="p-2">{s.customerName}</td>
                  <td className="p-2">{s.stoneName}</td>
                  <td className="p-2">{s.stoneType}</td>
                  <td className="p-2">{s.stoneWeight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No stones found.</p>
        )}
      </div>
    </div>
  );
}
