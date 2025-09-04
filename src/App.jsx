import { useState } from "react";

function App() {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);

    // Generate image previews
    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data.predictions);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Navbar */}
      <nav className="bg-blue-600 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Cow Breed Classifier</h1>
      </nav>

      <div className="flex flex-col items-center p-6">
        {/* Form */}
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
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
          >
            Predict Breeds
          </button>
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

        {/* Results */}
        {results.length > 0 && (
          <div className="w-full max-w-md mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Results:</h3>
            <ul className="space-y-2">
              {results.map((item) => (
                <li
                  key={item.index}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-md transition"
                >
                  <span className="font-medium">{item.filename}</span>
                  <span className="text-blue-600 font-semibold">{item.breed}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
