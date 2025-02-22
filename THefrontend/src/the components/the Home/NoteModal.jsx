import { FiX, FiPlus, FiMic } from "react-icons/fi";

export function NoteModal({
  setShowNewNoteModal,
  setNotes,
  newNote,
  setNewNote,
  isRecording,
  setIsRecording,
  recordingTime,
  setRecordingTime,
  handleImageUpload,
  createNote,
  updateRecordingResult,
  startRecording,
  stopRecording,
}) {
  return (
    <div className="fixed inset-0 flex justify-center items-center transition-opacity duration-300 px-4">
      {/* Blurred Background Instead of Black */}
      <div className="absolute inset-0 backdrop-blur-md bg-transparent"></div>

      {/* Modal Window (Responsive) */}
      <div className="bg-white/30 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl w-full max-w-md relative border border-white/20 text-white transition-transform transform scale-100 hover:scale-105 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button (Now Visible on Mobile) */}
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white transition duration-300"
          onClick={() => setShowNewNoteModal(false)}
        >
          <FiX size={24} />
        </button>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 border border-white/20 rounded-lg mb-3 bg-transparent text-cyan-800 placeholder-cyan-900 focus:ring-2 focus:ring-blue-700 focus:outline-none"
          value={newNote.title}
          required
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />

        {/* Note Text Area */}
        <textarea
          placeholder="Write your note..."
          className="w-full p-3 border border-white/20 rounded-lg bg-transparent text-cyan-800 placeholder-cyan-900 focus:ring-2 focus:ring-blue-700 focus:outline-none"
          rows="4"
          value={newNote.text}
          onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
        ></textarea>

        {/* Image Upload */}
        <div className="mt-4 flex items-center space-x-3">
          <label className="cursor-pointer flex items-center justify-center w-12 h-12 bg-white/20 rounded-full hover:bg-white/30 transition">
            <FiPlus className="text-cyan-700 text-2xl" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {newNote.image && newNote.image instanceof File && (
            <img
              src={URL.createObjectURL(newNote.image)}
              alt="Preview"
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
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition flex items-center space-x-2"
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
        {newNote.transcription && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-white/80">
              Transcription:
            </label>
            <textarea
              className="w-full p-2 border border-white/20 rounded-lg bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows="2"
              value={newNote.transcription}
              onChange={(e) =>
                setNewNote({ ...newNote, transcription: e.target.value })}
            ></textarea>
          </div>
        )}

        {/* Create Note Button (Now Visible on Mobile) */}
        <div className="mt-5">
          <button
            className="w-full px-6 py-3 bg-green-500 hover:bg-green-700 text-white rounded-lg text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={createNote}
          >
            Create Note
          </button>
        </div>
      </div>
    </div>
  );
}
