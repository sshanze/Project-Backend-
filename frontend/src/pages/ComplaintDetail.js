import React from "react";
import { useParams } from "react-router-dom";

const ComplaintDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Complaint Details</h1>
      <div className="bg-[#04395E] p-6 rounded-lg shadow-lg w-96">
        <p><strong>Complaint ID:</strong> {id}</p>
        <p><strong>Email:</strong> @pucit</p>
        <p><strong>Complaint Name:</strong> @pucit</p>
        <p><strong>Category:</strong> @pucit</p>
        <p><strong>Title:</strong> @pucit</p>
        <p><strong>Status:</strong> @pucit</p>
      </div>
    </div>
  );
};

export default ComplaintDetail;
