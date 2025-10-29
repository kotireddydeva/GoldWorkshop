import { useEffect, useState, useMemo } from "react";

export default function Summary() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(stored);
  }, []);

  const job = useMemo(() => jobs.find((j) => j.jobId === selectedJob), [jobs, selectedJob]);

  const summary = useMemo(() => {
    if (!job) return null;

    const itemsWeight = (job.items || []).reduce(
      (s, it) => s + parseFloat(it.totalWeight || 0),
      0
    );
    const materialsWeight = (job.materials || []).reduce(
      (s, m) => s + parseFloat(m.goldWeight || 0),
      0
    );
    const stonesWeight = (job.stones || []).reduce(
      (s, st) => s + parseFloat(st.stoneWeight || 0),
      0
    );

    const totalGoldIssued =
      parseFloat(job.goldWeight || 0) + parseFloat(job.additionalMaterial || 0);
    const goldUsed = itemsWeight + materialsWeight;
    const wastage = totalGoldIssued - goldUsed;
    const lossPercent =
      totalGoldIssued > 0 ? ((wastage / totalGoldIssued) * 100).toFixed(2) : 0;
    const efficiency =
      totalGoldIssued > 0 ? ((goldUsed / totalGoldIssued) * 100).toFixed(2) : 0;

    return {
      jobId: job.jobId,
      customer: job.customerName,
      jobType: job.jobType,
      totalGoldIssued,
      goldUsed,
      stonesWeight,
      wastage,
      lossPercent,
      efficiency,
      createdAt: job.createdAt,
      status: job.status,
    };
  }, [job]);

  const exportCSV = () => {
    if (!summary) return;
    const headers = [
      "Job ID",
      "Customer",
      "Job Type",
      "Total Gold Issued (g)",
      "Gold Used (g)",
      "Wastage (g)",
      "Loss (%)",
      "Efficiency (%)",
      "Stones (g)",
      "Status",
      "Date",
    ];
    const row = [
      summary.jobId,
      summary.customer,
      summary.jobType,
      summary.totalGoldIssued,
      summary.goldUsed,
      summary.wastage,
      summary.lossPercent,
      summary.efficiency,
      summary.stonesWeight,
      summary.status,
      summary.createdAt,
    ];
    const csv = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${summary.jobId}_Summary.csv`;
    link.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
        Step 6: Automatic Summary Calculation
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="border p-2 rounded w-64"
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="">Select Job ID</option>
          {jobs.map((j) => (
            <option key={j.jobId} value={j.jobId}>
              {j.jobId} - {j.customerName}
            </option>
          ))}
        </select>

        <button
          disabled={!summary}
          onClick={exportCSV}
          className={`px-4 py-2 rounded text-white ${
            summary ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Export Summary
        </button>
      </div>

      {!summary ? (
        <p className="text-gray-500">Please select a job to view summary.</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-3 text-yellow-700">
            Job Summary Report
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p><strong>Job ID:</strong> {summary.jobId}</p>
            <p><strong>Customer:</strong> {summary.customer}</p>
            <p><strong>Job Type:</strong> {summary.jobType}</p>
            <p><strong>Status:</strong> {summary.status}</p>
            <p><strong>Total Gold Issued:</strong> {summary.totalGoldIssued} g</p>
            <p><strong>Gold Used:</strong> {summary.goldUsed} g</p>
            <p><strong>Wastage:</strong> {summary.wastage.toFixed(2)} g</p>
            <p><strong>Loss %:</strong> {summary.lossPercent}%</p>
            <p><strong>Efficiency:</strong> {summary.efficiency}%</p>
            <p><strong>Stones Used:</strong> {summary.stonesWeight} g</p>
            <p><strong>Created At:</strong> {summary.createdAt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
