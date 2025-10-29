import { useEffect, useState } from "react";

export default function CreateJob() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    jobType: "22K",
    goldWeight: "",
    additionalMaterial: "",
    storeWeight: "",
    notes: "",
  });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("jobs"));
      if (Array.isArray(stored)) setJobs(stored);
    } catch (err) {
      console.error("Error loading jobs from storage:", err);
      setJobs([]);
    }
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem("jobs", JSON.stringify(jobs));
    }
  }, [jobs]);

  const generateJobId = () => {
    const year = new Date().getFullYear();
    const stored = JSON.parse(localStorage.getItem("jobs")) || [];
    const nextNumber = (stored.length + 1).toString().padStart(3, "0");
    return `JOB-${year}-${nextNumber}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.goldWeight) {
      alert("Please provide customer name and gold weight.");
      return;
    }

    const newJob = {
      jobId: generateJobId(),
      customerName: formData.customerName,
      jobType: formData.jobType,
      goldWeight: String(formData.goldWeight),
      storeWeight: String(formData.storeWeight || ""),
      additionalMaterial: String(formData.additionalMaterial || ""),
      notes: formData.notes || "",
      status: "Created",
      createdAt: new Date().toLocaleString(),
      items: [],
      materials: [],
      stages: [],
      stones: [],
    };

    const updated = [newJob, ...jobs];
    setJobs(updated);

    setFormData({
      customerName: "",
      jobType: "22K",
      goldWeight: "",
      additionalMaterial: "",
      storeWeight: "",
      notes: "",
    });

    alert("Job created and saved permanently (localStorage).");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-yellow-700 mb-4">Create New Job</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1">Customer Name</label>
            <input
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option>18K</option>
              <option>22K</option>
              <option>24K</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Gold Weight (g)</label>
            <input
              name="goldWeight"
              value={formData.goldWeight}
              onChange={handleChange}
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Additional Material (g)
            </label>
            <input
              name="additionalMaterial"
              value={formData.additionalMaterial}
              onChange={handleChange}
              type="number"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Store Weight (g)</label>
            <input
              name="storeWeight"
              value={formData.storeWeight}
              onChange={handleChange}
              type="number"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block font-semibold mb-1">Reference Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              rows="2"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
}
