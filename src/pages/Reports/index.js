import React, { useMemo, useState, useEffect } from "react";

export default function Reports() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(stored);
  }, []);

  const reports = jobs.map((j) => {
    const itemsWeight = (j.items || []).reduce(
      (s, it) => s + parseFloat(it.totalWeight || 0),
      0
    );
    const stonesWeight = (j.stones || []).reduce(
      (s, st) => s + parseFloat(st.stoneWeight || 0),
      0
    );
    const materialWeight = (j.materials || []).reduce(
      (s, m) => s + parseFloat(m.goldWeight || 0),
      0
    );

    const totalGold = parseFloat(j.goldWeight || 0);
    const usedGold = itemsWeight + materialWeight;
    const lossPercent = totalGold
      ? (((totalGold - usedGold) / totalGold) * 100).toFixed(2)
      : 0;

    return {
      job_code: j.jobId,
      customer_name: j.customerName,
      job_type: j.jobType,
      total_gold: totalGold,
      items_weight: itemsWeight,
      stones_weight: stonesWeight,
      loss_percent: lossPercent,
      status: j.status || "Ongoing",
      date: j.createdAt || "",
    };
  });

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchQuery =
        !query ||
        r.job_code.toLowerCase().includes(query.toLowerCase()) ||
        r.customer_name.toLowerCase().includes(query.toLowerCase());
      const matchType = !jobType || r.job_type === jobType;
      const matchFrom = !from || new Date(r.date) >= new Date(from);
      const matchTo = !to || new Date(r.date) <= new Date(to);
      const matchJob = !jobId || r.job_code === jobId;
      return matchQuery && matchType && matchFrom && matchTo && matchJob;
    });
  }, [reports, query, from, to, jobType, jobId]);

  const exportCSV = () => {
    if (!jobId) return alert("Please select a Job ID to export report.");

    const headers = [
      "Job ID",
      "Customer Name",
      "Job Type",
      "Gold (g)",
      "Items (g)",
      "Stones (g)",
      "Loss %",
      "Status",
      "Date",
    ];
    const csvRows = [
      headers.join(","),
      ...filtered.map((r) =>
        [
          r.job_code,
          r.customer_name,
          r.job_type,
          r.total_gold,
          r.items_weight,
          r.stones_weight,
          r.loss_percent,
          r.status,
          r.date,
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${jobId}_Report.csv`;
    link.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-yellow-700">
        Job Reports
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="border p-2 rounded w-56"
        >
          <option value="">All Jobs (View Only)</option>
          {jobs.map((j) => (
            <option key={j.jobId} value={j.jobId}>
              {j.jobId} — {j.customerName}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded w-52"
          placeholder="Search job or customer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded w-36"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="18K">18K</option>
          <option value="22K">22K</option>
          <option value="24K">24K</option>
        </select>
        <input
          type="date"
          className="border p-2 rounded"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <button
          onClick={exportCSV}
          disabled={!jobId}
          className={`px-4 py-2 rounded text-white ${
            jobId
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No reports found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-yellow-100 text-left">
              <tr>
                <th className="p-2">Job ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Type</th>
                <th className="p-2">Gold (g)</th>
                <th className="p-2">Items (g)</th>
                <th className="p-2">Stones (g)</th>
                <th className="p-2">Loss %</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.job_code}
                  className={`border-t ${
                    r.status === "Completed" ? "bg-green-50" : ""
                  }`}
                >
                  <td className="p-2">{r.job_code}</td>
                  <td className="p-2">{r.customer_name}</td>
                  <td className="p-2">{r.job_type}</td>
                  <td className="p-2">{r.total_gold}</td>
                  <td className="p-2">{r.items_weight}</td>
                  <td className="p-2">{r.stones_weight}</td>
                  <td className="p-2">{r.loss_percent}</td>
                  <td
                    className={`p-2 font-semibold ${
                      r.status === "Completed"
                        ? "text-green-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </td>
                  <td className="p-2">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
