import React from 'react';

const FileDetails = ({ fileDetails, totalTokens }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-white">File Details:</h3>
      {fileDetails.length > 0 ? (
        <ul>
          {fileDetails.map((file, index) => (
            <li className="text-white" key={index}>
              {file.file_path}: {file.token_count} tokens
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white">No files found.</p>
      )}
      <p className="mt-2 text-white">Total Tokens: {totalTokens}</p>
    </div>
  );
};

export default FileDetails;
