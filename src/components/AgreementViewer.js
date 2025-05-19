// src/components/AgreementViewer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AgreementViewer = ({ bundleID }) => {
  const [pdfData, setPdfData] = useState(null);
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/.netlify/functions/get-agreement-pdf?bundleID=${bundleID}`);
        
        if (response.data.success) {
          setPdfData(response.data.pdfData);
          setFilename(response.data.filename);
        } else {
          setError('Failed to load agreement');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the agreement');
      } finally {
        setLoading(false);
      }
    };

    if (bundleID) {
      fetchAgreement();
    }
  }, [bundleID]);

  const downloadPdf = () => {
    // Create a download link
    const linkSource = `data:application/pdf;base64,${pdfData}`;
    const downloadLink = document.createElement("a");
    const fileName = filename || "agreement.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  if (loading) return <div>Loading agreement...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pdfData) return <div>No agreement found</div>;

  return (
    <div className="agreement-viewer">
      <h2>Signed Agreement</h2>
      <div className="controls mb-4">
        <button
          onClick={downloadPdf}
          className="bg-[#D28C00] text-white px-4 py-2 rounded hover:bg-[#B77A00]"
        >
          Download PDF
        </button>
      </div>
      
      {/* Display PDF in browser */}
      <div className="pdf-container" style={{ height: '600px', border: '1px solid #ccc' }}>
        <iframe
          src={`data:application/pdf;base64,${pdfData}`}
          width="100%"
          height="100%"
          title="Agreement PDF"
        />
      </div>
    </div>
  );
};

export default AgreementViewer;
