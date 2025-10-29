const JobCard = ({ job, onDelete }) => {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm mb-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-yellow-700">{job.jobId}</h3>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          Delete
        </button>
      </div>
      <p className="text-gray-700">
        <strong>Customer:</strong> {job.customerName}
      </p>
      <p className="text-gray-700">
        <strong>Type:</strong> {job.jobType} | <strong>Gold:</strong> {job.goldWeight}g
      </p>
      <p className="text-gray-700">
        <strong>Store:</strong> {job.storeWeight}g |{" "}
        <strong>Extra:</strong> {job.additionalMaterial || 0}g
      </p>
      {job.notes && (
        <p className="text-gray-500 italic">“{job.notes}”</p>
      )}
      <p className="text-xs text-gray-400 mt-1">Created: {job.createdAt}</p>
    </div>
  );
};

export default JobCard;
