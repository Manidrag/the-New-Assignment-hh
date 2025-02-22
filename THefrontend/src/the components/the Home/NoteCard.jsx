import { FiTrash2, FiVolume2 } from "react-icons/fi";
import { FaRegCopy, FaStar } from "react-icons/fa";

export function NoteCard({
  note,
  setSelectedNote,
  setIsEditing,
  copyNote,
  deleteNote,
  speakText,
  setNotes,
}) {
  return (
    <div
      key={note._id}
      className="bg-white rounded-xl shadow-md overflow-hidden relative cursor-pointer transition transform hover:scale-105 duration-300 ease-in-out mx-auto max-w-sm w-full"
      onClick={() => {
        setSelectedNote(note);
        setIsEditing(false);
      }}
    >
      {/* Date Badge */}
      <div className="absolute top-2 right-2 bg-gray-100 text-gray-600 text-xs py-1 px-2 rounded-full font-medium transition-opacity duration-300">
        {note.date}
      </div>

      {/* Content Area */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 transition-colors duration-300">
          {note.title}
        </h3>

        {note.audio && typeof note.audio === "string" ? (
          <div className="mt-2">
            <audio controls className="w-full">
              <source src={note.audio} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            {note.transcription && note.transcription.trim() !== "" && (
              <div className="mt-1">
                <label className="block text-sm font-medium text-gray-600 mb-1 transition-colors duration-300">
                  Transcription:
                </label>
                <textarea
                  readOnly
                  className="w-full p-2 border rounded-lg text-gray-700 bg-gray-50 text-sm transition-colors duration-300"
                  rows="2"
                  value={note.transcription}
                ></textarea>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-700 mt-2 line-clamp-3 transition-colors duration-300">{note.text}</p>
        )}

        {note.image && (
          <img
            src={note.image}
            alt="Note"
            className="mt-3 rounded-md w-full h-32 object-cover transition-opacity duration-300 hover:scale-105 hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              //setFullscreenImage(note.image);
            }}
          />
        )}
      </div>

      {/* Actions */}
      <div
        className="bg-gray-50 p-3 border-t border-gray-200 flex justify-around items-center"
        onClick={(e) => e.stopPropagation()} // Prevent click propagation
      >
        <button
          onClick={async (e) => {
            e.stopPropagation();
            try {
              if (note.favourite) {
                await fetch(
                  `https://the-backend-by8h.onrender.com/notes/unfavourite/${note._id}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                setNotes((prevNotes) =>
                  prevNotes.map((n) =>
                    n._id === note._id ? { ...n, favourite: false } : n
                  )
                );
              } else {
                await fetch(
                  `https://the-backend-by8h.onrender.com/notes/favourite/${note._id}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                setNotes((prevNotes) =>
                  prevNotes.map((n) =>
                    n._id === note._id ? { ...n, favourite: true } : n
                  )
                );
              }
            } catch (error) {
              console.error("Error toggling favourite:", error);
            }
          }}
          className="text-gray-500 hover:text-yellow-500 focus:outline-none transition-colors duration-300"
        >
          <FaStar
            className={`h-5 w-5 cursor-pointer ${
              note.favourite ? "text-yellow-500" : ""
            } transition-colors duration-300`}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyNote(note.text);
          }}
          className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors duration-300"
        >
          <FaRegCopy className="h-5 w-5 transition-colors duration-300 cursor-crosshair" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            speakText(note.text);
          }}
          className="text-gray-500 hover:text-green-500 focus:outline-none transition-colors duration-300"
        >
          <FiVolume2 className="h-5 w-5 transition-colors duration-300" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note._id);
          }}
          className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-300"
        >
          <FiTrash2 className="h-5 w-5 transition-colors duration-300 cursor-grab" />
        </button>
      </div>
    </div>
  );
}