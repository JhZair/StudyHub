import React from 'react';

const RDFMetadata = () => {
  return (
    <>
      <link rel="alternate" type="application/rdf+xml" title="RDF metadata" href="/studyhub.rdf" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="StudyHub" />
      <meta property="og:description" content="Sistema de gestión de estudios y recursos educativos" />
      <meta property="og:url" content="https://studyhubfrontend-5pmm.onrender.com" />
      <meta property="og:image" content="/logo.png" />
    </>
  );
};

export default RDFMetadata;
