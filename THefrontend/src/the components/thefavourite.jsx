import { useState, useEffect } from "react";

export function Sun() {
  const [favNotes, setFavNotes] = useState([]);
  const user = "123123"; // Replace with the actual user ID or get it from auth context

  useEffect(() => {
    const fetchFavouriteNotes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/notes/favourites/${user}`);
        const data = await response.json();
        console.log("Favourite Notes:", data);
        setFavNotes(data);
      } catch (error) {
        console.error("Error fetching favourite notes:", error);
      }
    };
    fetchFavouriteNotes();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Favourite Notes</h2>
      {favNotes.length === 0 ? (
        <p className="text-gray-600">No favourite notes found.</p>
      ) : (
        favNotes.map((note) => (
          <div key={note._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <p className="text-xs text-gray-400">{note.date}</p>
            <h3 className="font-semibold text-lg text-gray-800">{note.title}</h3>
            <p className="text-gray-600 mt-2">{note.text}</p>
            {note.image && (
              <img
                src={note.image} // if you store Base64 strings directly or use note.imageUrl if using URLs
                alt="Note"
                className="mt-2 rounded-lg w-16 h-16 object-cover"
              />
            )}
            {note.audio && (
              <audio controls className="w-full mt-2">
                <source src={note.audio} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            )}
            {note.transcription && (
              <div className="mt-1">
                <label className="text-sm font-medium text-gray-600">Transcription:</label>
                <textarea
                  readOnly
                  className="w-full p-2 border rounded-lg text-gray-600 mt-1"
                  rows="2"
                  value={note.transcription}
                ></textarea>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
