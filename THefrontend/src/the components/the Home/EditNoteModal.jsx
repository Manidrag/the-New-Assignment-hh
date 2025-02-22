import { FiX, FiPlus, FiMic, FiEdit, FiSave } from "react-icons/fi";
import { useState } from "react";

export function EditNoteModal({
  selectedNote,
  setSelectedNote,
  isEditing,
  setIsEditing,
  handleEditImageUpload,
  updateNote,
  isRecording,
  startRecording,
  stopRecording,
  recordingTime,
}) {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  return (
    <div className="fixed inset-0 flex justify-center items-center transition-opacity duration-300 px-4">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 backdrop-blur-lg bg-white/10"></div>

      {/* Fullscreen Modal */}
      <div className="relative w-full max-w-3xl h-[90vh] bg-white/20 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/30 text-white overflow-y-auto">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition duration-300"
          onClick={() => {
            setSelectedNote(null);
            setIsEditing(false);
          }}
        >
          <FiX size={24} />
        </button>

        {/* Note Content */}
        {!isEditing ? (
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedNote.title}</h2>
            <p className="mt-3 text-white/80">{selectedNote.text}</p>

            {/* Audio */}
            {selectedNote.audio && typeof selectedNote.audio === "string" && (
              <div className="mt-3">
                <audio controls className="w-full">
                  <source src={selectedNote.audio} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Transcription */}
            {selectedNote.transcription && (
              <div className="mt-3">
                <label className="text-sm font-medium text-white/80">Transcription:</label>
                <textarea
                  readOnly
                  className="w-full p-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  rows="2"
                  value={selectedNote.transcription}
                ></textarea>
              </div>
            )}

            {/* Image */}
            {selectedNote.image && (
              <img
                src={selectedNote.image}
                alt="Note"
                className="mt-3 rounded-lg cursor-pointer w-full max-h-72 object-cover transition-transform hover:scale-105"
                onClick={() => setFullscreenImage(selectedNote.image)}
              />
            )}

            {/* Edit Button */}
            <button
              className="mt-5 w-full px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit /> Edit Note
            </button>
          </div>
        ) : (
          <div>
            {/* Title Input */}
            <input
              type="text"
              className="w-full p-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={selectedNote.title}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, title: e.target.value })
              }
            />

            {/* Text Area */}
            <textarea
              className="w-full p-3 mt-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows="6"
              value={selectedNote.text}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, text: e.target.value })
              }
            ></textarea>

            {/* Image Upload */}
            <div className="mt-4 flex items-center space-x-3">
              <label className="cursor-pointer flex items-center justify-center w-12 h-12 bg-white/20 rounded-full hover:bg-white/30 transition">
                <FiPlus className="text-white text-2xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="hidden"
                />
              </label>
              {selectedNote.image && (
                <img
                  src={selectedNote.image}
                  alt="Note"
                  className="w-12 h-12 rounded-lg object-cover border border-white/30"
                />
              )}
            </div>

            {/* Audio Recording */}
            <div className="flex items-center gap-3 mt-4">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-lg transition flex items-center space-x-2"
                >
                  <FiMic />
                  <span>Record</span>
                </button>
              )}
              {isRecording && (
                <span className="text-sm text-white/70">{recordingTime}s</span>
              )}
            </div>

            {/* Transcription */}
            <div className="mt-4">
  <label className="block text-sm font-medium text-white/80">
    Transcription:
  </label>
  <textarea
    className="w-full p-3 border border-white/30 rounded-lg bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    rows="2"
    value={selectedNote.transcription || ""}
    onChange={(e) =>
      setSelectedNote({
        ...selectedNote,
        transcription: e.target.value,
      })
    }
  ></textarea>
</div>


            {/* Save Button */}
            <button
  className="mt-5 w-full px-6 py-3 bg-green-500 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
  onClick={() => {
    if (isRecording) {
      stopRecording(); // Ensure recording stops on save
    }
    updateNote(selectedNote._id);
    setIsEditing(false);
  }}
>
  <FiSave /> Save Note
</button>
          </div>
        )}
      </div>
    </div>
  );
}
