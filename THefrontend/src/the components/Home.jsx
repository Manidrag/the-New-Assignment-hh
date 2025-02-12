import { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiMic,
  FiTrash2,
  FiVolume2,
  FiPlus,
  FiX,
  FiImage,
} from "react-icons/fi";
import { FaRegCopy } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { hover } from "framer-motion";
import {motion} from "framer-motion";
export function Home() {
  if (!localStorage.getItem("token")) {
    window.location.href = "/Signin";
  }
  const [notes, setNotes] = useState([]);
  // Add this state at the top along with your other useState hooks
  const [showFavourites, setShowFavourites] = useState(false);

  // newNote now includes transcription, image, and audio properties.
  const [newNote, setNewNote] = useState({
    title: "",
    text: "",
    transcription: "",
    image: "",
    audio: "",
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedNote, setSelectedNote] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({ name: "Username", isSignedIn: false });
  // Controls edit mode in the expanded note view.
  const [isEditing, setIsEditing] = useState(false);
  // Modal states for creating a new note and fullscreen image view.
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Refs for speech recognition, audio recording, timer, and auto-stop timeout.
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("dateAsc");

  // -------------------------------
  // FETCH NOTES ON COMPONENT MOUNT
  // -------------------------------
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/notes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setLoading(false);
        const data = await response.json();

        if (data.message === "unauthorized" || data.message === "jwt expired") {
          localStorage.removeItem("token");
          window.location.href = "/Signin";
        }
        setNotes(data);

        setUser({ name: data[0].user, isSignedIn: true });
      } catch (err) {
        console.error("Error fetching notes", err);
      }
    };
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md">
        <div
          className="w-20 h-20 rounded-full animate-spin"
          style={{
            border: "6px solid rgba(255,255,255,0.1)", // light, almost transparent border
            borderTopColor: "#39FF14", // neon green for the top border
            boxShadow: "0 0 15px #39FF14, 0 0 30px #39FF14", // neon glow effect
          }}
        ></div>
      </div>
    );
  }

  // -------------------------------
  // Helper: Updates recording result to either newNote or selectedNote
  // -------------------------------
  const updateRecordingResult = (data) => {
    if (isEditing && selectedNote) {
      setSelectedNote((prev) => ({ ...prev, ...data }));
    } else {
      setNewNote((prev) => ({ ...prev, ...data }));
    }
  };

  // -------------------------------
  // Image Upload Handlers
  // -------------------------------
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewNote((prev) => ({ ...prev, image: file })); // Store File object directly
    }
  };

  const handleEditImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedNote((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------------------
  // Other Utility Functions
  // -------------------------------
  const copyNote = (text) => {
    navigator.clipboard.writeText(text);
    alert("Note copied!");
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      // Update local state: filter out the deleted note
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  // -------------------------------
  // API: Create Note Function
  // -------------------------------
  const createNote = async () => {
    if (!newNote.title) {
      alert("Title is required");
      return;
    }
    if (!newNote.text) {
      alert("Note is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", newNote.title);
    formData.append("text", newNote.text);
    formData.append("transcription", newNote.transcription || "");
    formData.append("user", user.name);

    if (newNote.image instanceof File) {
      formData.append("image", newNote.image);
    }

    if (newNote.audio instanceof File) {
      formData.append("audio", newNote.audio);
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/notes/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData, // Send formData instead of JSON
      });

      setLoading(false);
      const result = await response.json();

      if (
        result.message === "unauthorized" ||
        result.message === "jwt expired"
      ) {
        localStorage.removeItem("token");
        window.location.href = "/Signin";
      }

      // Update UI with new note
      setNotes((prev) => [...prev, result.note]);
      setNewNote({
        title: "",
        text: "",
        transcription: "",
        image: "",
        audio: "",
      });
      setShowNewNoteModal(false);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };
  const updateNote = async (id) => {
    if (!selectedNote.title) {
      alert("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", selectedNote.title);
    formData.append("text", selectedNote.text);
    formData.append("transcription", selectedNote.transcription || "");

    if (selectedNote.image instanceof File) {
      formData.append("image", selectedNote.image);
    }

    if (selectedNote.audio instanceof File) {
      formData.append("audio", selectedNote.audio);
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData, // FormData handles file upload
      });

      setLoading(false);
      const result = await response.json();

      if (
        result.message === "unauthorized" ||
        result.message === "jwt expired"
      ) {
        localStorage.removeItem("token");
        window.location.href = "/Signin";
      }

      // ✅ Update UI with edited note
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? result.note : note))
      );
      setSelectedNote(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  // -------------------------------
  // Recording Functions (for both creation and editing)
  // -------------------------------
  const startRecording = async () => {
    if (!("webkitSpeechRecognition" in window) || !navigator.mediaDevices) {
      alert(
        "Your browser does not support audio recording or speech recognition."
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], "recorded_audio.webm", {
          type: "audio/webm",
        });
        updateRecordingResult({ audio: audioFile }); // Store File object instead of URL
      };
      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting audio recording:", error);
      alert("Could not start audio recording.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    let finalTranscript = "";
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const transcription = (finalTranscript + interimTranscript).trim();
      updateRecordingResult({ transcription });
    };
    recognition.onerror = () => {
      setIsRecording(false);
      clearTimeout(timeoutRef.current);
      clearInterval(recordingIntervalRef.current);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
    recognition.start();
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    timeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 60000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearTimeout(timeoutRef.current);
    clearInterval(recordingIntervalRef.current);
  };
  const displayedNotes = showFavourites
    ? notes.filter((note) => note.favourite)
    : notes;
  const filteredNotes = displayedNotes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  ////////
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortCriteria === "dateAsc") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortCriteria === "dateDesc") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortCriteria === "titleAsc") {
      return a.title.localeCompare(b.title);
    } else if (sortCriteria === "titleDesc") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  // -------------------------------
  // JSX Rendering
  // -------------------------------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 fixed top-0 left-0 h-screen  bg-white p-4 shadow-lg overflow-y-auto transition-all duration-400">
        <h2 className="text-xl font-bold text-center">AI Notes</h2>
        <nav className="mt-6 space-y-4">
          <a
            href="/Home"
            className={`block py-2 px-3 rounded-lg bg-purple-100 text-center transition-colors hover:bg-purple-200 ${
              showFavourites
                ? "bg-purple-50 text-blue-100"
                : "bg-purple-400 text-gray-700"
            }'`}
          >
            🏠 Home
          </a>
          <NavLink
            onClick={() => setShowFavourites(true)}
            className={`block py-2 px-3 rounded-lg bg-purple-100 text-center transition-colors hover:bg-purple-200 ${
              !showFavourites
                ? "bg-purple-50 text-blue-400"
                : "bg-purple-500 text-gray-700"
            }`}
          >
            🌟 Favourite
          </NavLink>
        </nav>

        {/* /// */}
      </motion.aside>

      {/* Main Content */}
      <main className="mflex-1 ml-64 p-6 overflow-y-auto">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 shadow-lg rounded-lg  w-full z-10 gap-10">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative w-full max-w-xs">
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className="px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {" "}
              Sort By
              <option value="dateAsc">Date [Oldest First]</option>
              <option value="dateDesc">Date [Newest First]</option>
              <option value="titleAsc">Title [A-Z]</option>
              <option value="titleDesc">Title [Z-A]</option>
            </select>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center px-3 py-1 border rounded-lg text-gray-700"
            >
              <FiUser className="text-gray-600 mr-2" /> {user.name}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-50">
                <NavLink
                  to="/Home"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Home
                </NavLink>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/Signin";
                  }}
                  className="block px-4 py-2 z-1000 hover:bg-gray-100"
                >
                  LogOut
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="flex flex-wrap gap-2">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="h-80 w-72 bg-white p-4 rounded-lg shadow-lg relative cursor-pointer max-w-xs mx-auto transition transform hover:scale-105"
              onClick={() => {
                setSelectedNote(note);
                setIsEditing(false);
              }}
            >
              <p className="text-xs text-gray-400">{note.date}</p>
              <h3 className="font-semibold text-lg text-gray-800">
                {note.title}
              </h3>
              {note.audio ? (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={note.audio} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                  {note.transcription && (
                    <div className="mt-1">
                      <label className="text-sm font-medium text-gray-600">
                        Transcription:
                      </label>
                      <textarea
                        readOnly
                        className="w-full p-2 border rounded-lg text-gray-600 mt-1"
                        rows="2"
                        value={note.transcription}
                      ></textarea>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 mt-2">{note.text}</p>
              )}
              {note.image && (
                <img
                  src={note.image}
                  alt="Note"
                  className="mt-2 rounded-lg w-16 h-16 object-cover cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenImage(note.image);
                  }}
                />
              )}
              <div className="flex justify-around mt-2">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      if (note.favourite) {
                        // If already favourite, send request to remove it

                        const response = await fetch(
                          `http://localhost:3000/notes/unfavourite/${note._id}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );

                        const data = await response.json();

                        if (
                          data.message === "unauthorized" ||
                          data.message === "jwt expired"
                        ) {
                          localStorage.removeItem("token");
                          window.location.href = "/Signin";
                        }
                        // Update local state to mark this note as not favourite
                        setNotes((prevNotes) =>
                          prevNotes.map((n) =>
                            n._id === note._id ? { ...n, favourite: false } : n
                          )
                        );
                      } else {
                        // Otherwise, mark it as favourite

                        const response = await fetch(
                          `http://localhost:3000/notes/favourite/${note._id}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        );
                        const data = await response.json();

                        if (
                          data.message === "unauthorized" ||
                          data.message === "jwt expired"
                        ) {
                          localStorage.removeItem("token");
                          window.location.href = "/Signin";
                        }
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
                  className="cursor-pointer hover:text-yellow-600"
                >
                  <FaStar
                    className={
                      note.favourite ? "text-yellow-500" : "text-gray-40"
                    }
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyNote(note.text);
                  }}
                  className="cursor-pointer text-blue-500 hover:text-blue-600  hover:border-r-violet-500  hover:border-4"
                >
                  <FaRegCopy />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(note.text);
                  }}
                  className="cursor-pointer text-green-500 hover:text-green-600 hover:border-r-violet-500  hover:border-4"
                >
                  <FiVolume2 />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note._id);
                  }}
                  className="cursor-pointer text-red-500 hover:text-red-600 hover:border-r-violet-500  hover:border-4"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* T Create Note Button at Bottom Center */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setShowNewNoteModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-xl"
          >
            Create Note
          </button>
        </div>
      </main>

      {/* New Note Creation Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                }
                setShowNewNoteModal(false);
              }}
            >
              <FiX />
            </button>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newNote.title}
              required
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
            />
            <textarea
              placeholder="Write your note..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              value={newNote.text}
              onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
            ></textarea>
            {/* Image add option as plus sign */}
            <div className="mt-3 flex items-center">
              <label className="cursor-pointer inline-flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <FiPlus className="text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {newNote.image && (
                <img
                  src={newNote.image}
                  alt="Preview"
                  className="ml-4 h-10 w-10 rounded-full object-cover"
                />
              )}
            </div>
            {/* Recording Controls */}
            <div className="flex items-center gap-2 mt-3">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  <FiMic />
                </button>
              )}
              {isRecording && (
                <span className="text-sm ml-2">
                  Recording: {recordingTime}s
                </span>
              )}
            </div>
            {newNote.transcription && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-600">
                  Transcription:
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="2"
                  value={newNote.transcription}
                  onChange={(e) =>
                    setNewNote({ ...newNote, transcription: e.target.value })
                  }
                ></textarea>
              </div>
            )}
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                  setTimeout(() => {
                    createNote();
                  }, 500);
                } else {
                  createNote();
                }
              }}
            >
              Create Note
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Note Viewer / Editor Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => {
                setSelectedNote(null);
                setIsEditing(false);
              }}
            >
              <FiX />
            </button>
            {!isEditing ? (
              // Read-only mode.
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedNote.title}
                </h2>
                <p className="mt-2 text-gray-600">{selectedNote.text}</p>
                {selectedNote.audio && (
                  <div className="mt-2">
                    <audio controls className="w-full">
                      <source src={selectedNote.audio} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                    {selectedNote.transcription && (
                      <div className="mt-1">
                        <label className="text-sm font-medium text-gray-600">
                          Transcription:
                        </label>
                        <textarea
                          readOnly
                          className="w-full p-2 border rounded-lg text-gray-600 mt-1"
                          rows="2"
                          value={selectedNote.transcription}
                        ></textarea>
                      </div>
                    )}
                  </div>
                )}
                {selectedNote.image && (
                  <img
                    src={selectedNote.image}
                    alt="Note"
                    className="mt-2 rounded-lg cursor-pointer"
                    onClick={() => setFullscreenImage(selectedNote.image)}
                  />
                )}
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
            ) : (
              // Edit mode.
              <div>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={selectedNote.title}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      title: e.target.value,
                    })
                  }
                />
                <textarea
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="6"
                  value={selectedNote.text}
                  onChange={(e) =>
                    setSelectedNote({
                      ...selectedNote,
                      text: e.target.value,
                    })
                  }
                ></textarea>
                {selectedNote.image && (
                  <img
                    src={selectedNote.image}
                    alt="Note"
                    className="mt-2 rounded-lg"
                  />
                )}
                {/* Image add option as plus sign in edit mode */}
                <div className="mt-2 flex items-center">
                  <label className="cursor-pointer inline-flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                    <FiPlus className="text-xl" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {/* Audio recording controls in edit mode */}
                <div className="flex items-center gap-2 mt-2">
                  {isRecording ? (
                    <button
                      onClick={stopRecording}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Stop Recording
                    </button>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                      <FiMic />
                    </button>
                  )}
                  {isRecording && (
                    <span className="text-sm ml-2">
                      Recording: {recordingTime}s
                    </span>
                  )}
                </div>
                {selectedNote.audio && selectedNote.transcription && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Transcription:
                    </label>
                    <textarea
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows="2"
                      value={selectedNote.transcription}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          transcription: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                )}
                <button
                  className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg"
                  onClick={() => {
                    updateNote(selectedNote._id);
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex justify-center items-center">
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setFullscreenImage(null)}
          >
            ×
          </button>
          <img
            src={fullscreenImage}
            alt="Full Screen"
            className="max-h-full max-w-full"
          />
        </div>
      )}
    </div>
  );
}
