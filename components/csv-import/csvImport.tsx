"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { importMembers } from "@/lib/actions/members";
import { useClub } from "@/providers/clubprovider";

export default function CsvImport({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<
    Record<string, string>[] | null
  >(null);
  const [data, setData] = useState<Record<string, string>[] | null>(null);

  const { selectedClub } = useClub();

  const handleDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    if (acceptedFiles[0]) {
      Papa.parse(acceptedFiles[0], {
        header: true,
        complete: (results: { data: Record<string, string>[] }) => {
          console.log(results.data);
          setData(results.data);
          setPreviewData(results.data.slice(0, 5));
        },
      });
    }
  };

  const handleImport = () => {
    if (data) {
      try {
        importMembers(data, selectedClub?.clubId ?? "");
        setFile(null);
        setPreviewData(null);
        setData(null);
        onSuccess?.();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "text/csv": [".csv"],
    },
  });

  return (
    <div className="w-full">
      {!file && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-brand-green transition-colors"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the CSV file here...</p>
          ) : (
            <p>Drag and drop a CSV file here, or click to select one</p>
          )}
        </div>
      )}
      {file && previewData && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium text-brand-green">
              Selected: {file.name}
            </p>
            <button
              onClick={() => {
                setFile(null);
                setPreviewData(null);
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Choose another file
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Preview (Eerste 5 rijen)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full mt-4 text-left border-collapse">
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th key={key} className="border border-gray-200 px-4 py-2">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td
                        key={index}
                        className="border border-gray-200 px-4 py-2"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleImport}
            className="bg-brand-green text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-navy transition-colors"
          >
            Import Members
          </button>
        </div>
      )}
    </div>
  );
}
