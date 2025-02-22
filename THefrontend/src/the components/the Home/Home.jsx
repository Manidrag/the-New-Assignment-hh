import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { NoteCard } from "./NoteCard";
import { NoteModal } from "./NoteModal";
import { EditNoteModal } from "./EditNoteModal";
import { motion } from "framer-motion";
import ErrorBoundary from "../../ErrorBoundary";
import { BackgroundImg } from "../../BackgroundImages";

export function Home() {
  if (!localStorage.getItem("token")) {
    window.location.href = "/Signin";
  }

  const [notes, setNotes] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);
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
  const [isEditing, setIsEditing] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("dateAsc");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [recordingTimeout, setRecordingTimeout] = useState(null);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://the-backend-by8h.onrender.com/notes", {
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

        

        setNotes(Array.isArray(data) ? data : []);
        setUser({ name: data[0]?.user || "Username", isSignedIn: true });
      } catch (err) {
        console.error("Error fetching notes", err);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const updateRecordingResult = (data) => {
    if (isEditing && selectedNote) {
      setSelectedNote((prev) => ({ ...prev, ...data }));
    } else {
      setNewNote((prev) => ({ ...prev, ...data }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewNote((prev) => ({ ...prev, image: file }));
    }
  };

  const handleEditImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store the file for upload, not just a preview URL
      setSelectedNote((prev) => ({ ...prev, image: file }));
    }
  };

  const copyNote = (text) => {
    navigator.clipboard.writeText(text);
    alert("Note copied!");
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`https://the-backend-by8h.onrender.com/notes/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const sendRequest = async (url, method, body) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body,
      });
      setLoading(false);
      return await response.json();
    } catch (err) {
      console.error(`Error ${method} request to ${url}:`, err);
      setLoading(false);
      throw err;
    }
  };

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

    if (newNote.audio instanceof Blob) {
      formData.append("audio", newNote.audio);
    }

    try {
      const result = await sendRequest("https://the-backend-by8h.onrender.com/notes/add", "POST", formData);

      if (result.message === "unauthorized" || result.message === "jwt expired") {
        localStorage.removeItem("token");
        window.location.href = "/Signin";
      }

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
    if (selectedNote.audio instanceof File || selectedNote.audio instanceof Blob) {
      formData.append("audio", selectedNote.audio);
    }

    try {
      const result = await sendRequest(`https://the-backend-by8h.onrender.com/notes/${id}`, "PUT", formData);

      if (result.message === "unauthorized" || result.message === "jwt expired") {
        localStorage.removeItem("token");
        window.location.href = "/Signin";
      }

      setNotes((prev) =>
        prev.map((note) => (note._id === id ? result.note : note))
      );
      setSelectedNote(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
  
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();
      recognizer.lang = 'en-US';
      recognizer.continuous = true;
      recognizer.interimResults = true;
  
      recognizer.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        if (isEditing && selectedNote) {
          // When editing, update the selected note's transcription.
          setSelectedNote(prev => ({ ...prev, transcription: transcript }));
        } else {
          setNewNote(prev => ({ ...prev, transcription: transcript }));
        }
      };
      
  
      setRecognition(recognizer);
      recognizer.start();
  
      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };
  
      recorder.start();
      setIsRecording(true);
  
      // Automatically stop recording after 60 seconds
      const timeoutId = setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 60000); // 60,000 ms = 1 minute
      setRecordingTimeout(timeoutId);
  
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
  
      // Clear the auto-stop timeout if it exists
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        setRecordingTimeout(null);
      }
  
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        if (isEditing && selectedNote) {
          setSelectedNote(prev => ({ ...prev, audio: audioBlob }));
        } else {
          setNewNote(prev => ({ ...prev, audio: audioBlob }));
        }
      };
      
      if (recognition) {
        recognition.stop();
      }
    }
  };
  

  const displayedNotes = showFavourites
    ? notes.filter((note) => note && note.favourite)
    : notes;
  const filteredNotes = displayedNotes.filter((note) =>
    note && note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  //ggtttt

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md transition-opacity duration-300">
        <div
          className="w-20 h-20 rounded-full animate-spin"
          style={{
            border: "6px solid rgba(255,255,255,0.1)",
            borderTopColor: "#39FF14",
            boxShadow: "0 0 15px #39FF14, 0 0 30px #39FF14",
          }}
        ></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BackgroundImg interval={7000}>
        <div className="flex flex-col md:flex-row h-full">
          <Sidebar
            showFavourites={showFavourites}
            setShowFavourites={setShowFavourites}
            newdata={user.name}
          />
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Warning Banner */}
            <div className="bg-yellow-200 p-2 text-center text-sm font-bold mb-4">
              This is just a small project. Do not put sensitive information! But You can make Notes!
            </div>
            <Navbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortCriteria={sortCriteria}
              setSortCriteria={setSortCriteria}
              user={user.name}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setShowFavourites={setShowFavourites}
            />
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              {sortedNotes.length === 0 ? (
                <div className="text-center text-gray-500">
                  <p>No notes available. Create a new note! 😊</p>
                </div>
              ) : (
                sortedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    setSelectedNote={setSelectedNote}
                    setIsEditing={setIsEditing}
                    copyNote={copyNote}
                    deleteNote={deleteNote}
                    speakText={speakText}
                    setNotes={setNotes}
                  />
                ))
              )}
            </div>
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => setShowNewNoteModal(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-xl hover:bg-blue-700 transition duration-200"
              >
                Create Note
              </button>
            </div>
          </main>

          {showNewNoteModal && (
            <NoteModal
              setShowNewNoteModal={setShowNewNoteModal}
              setNotes={setNotes}
              newNote={newNote}
              setNewNote={setNewNote}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              recordingTime={recordingTime}
              setRecordingTime={setRecordingTime}
              handleImageUpload={handleImageUpload}
              createNote={createNote}
              updateRecordingResult={updateRecordingResult}
              startRecording={startRecording}
              stopRecording={stopRecording}
            />
          )}

          {selectedNote && (
            <EditNoteModal
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleEditImageUpload={handleEditImageUpload}
              updateNote={updateNote}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              recordingTime={recordingTime}
              setRecordingTime={setRecordingTime}
              updateRecordingResult={updateRecordingResult}
              startRecording={startRecording}
              stopRecording={stopRecording}
            />
          )}

          {fullscreenImage && (
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex justify-center items-center transition-opacity duration-300">
              <button
                className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition duration-200"
                onClick={() => setFullscreenImage(null)}
              >
                ×
              </button>
              <img
                src={fullscreenImage}
                alt="Full Screen"
                className="max-h-full max-w-full object-contain transition-opacity duration-300"
              />
            </div>
          )}
        </div>
      </BackgroundImg>
    </ErrorBoundary>
  );
}