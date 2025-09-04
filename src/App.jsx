import { useState } from "react";

function App() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]); // clear previous results

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      // Simulate 1.5 sec delay for nice loading animation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data.predictions);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <nav className="bg-blue-600 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Cow Breed Classifier</h1>
      </nav>

      <div className="flex flex-col items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 mt-6"
        >
          <label className="block text-gray-700 font-medium">Upload Cow Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-500 file:text-white
               hover:file:bg-blue-600
               cursor-pointer"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow flex-1"
              disabled={loading}
            >
              {loading ? "Searching..." : "Predict Breeds"}
            </button>

            <button
              type="button"
              onClick={() => {
                setFiles([]);
                setPreviews([]);
                setResults([]);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow flex-1"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="w-full max-w-md mt-6 grid grid-cols-2 gap-4">
            {previews.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx}`}
                className="w-full h-40 object-cover rounded-lg shadow"
              />
            ))}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !loading && (
          <div className="w-full max-w-md mt-6 animate-fadeIn">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Results:</h3>
            <ul className="space-y-2">
              {results.map((item, idx) => (
                <li
                  key={item.index}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition transform hover:scale-105"
                >
                  <span className="font-medium">
                    {`Cow ${idx + 1} breed name according to our research and analysis is:`}
                  </span>
                  <span
                    className="px-3 py-1 bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 
                       text-blue-800 font-semibold rounded-full shadow-md"
                  >
                    {item.breed}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }
        `}
      </style>
    </div>
  );
}

export default App;
