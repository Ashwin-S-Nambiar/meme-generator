import React, { useRef, useState, useEffect } from "react";
import { X, CircleCheck } from "lucide-react";
import fallBackImg from "/fallback-meme.jpg";

export default function Meme() {
  const [meme, setMeme] = useState({
    randomImage: "http://i.imgflip.com/1bij.jpg",
    texts: []
  });
  const [currentText, setCurrentText] = useState("");
  const [allMemes, setAllMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTextIndex, setEditingTextIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTextIndex, setDraggedTextIndex] = useState(null);
  const memeRef = useRef(null);

  useEffect(() => {
    async function fetchMemes() {
      try {
        const res = await fetch("https://api.imgflip.com/get_memes");
        const data = await res.json();
        setAllMemes(data.data.memes);
      } catch (error) {
        console.error("Failed to fetch memes:", error);
      }
    }
    fetchMemes();
  }, []);

  async function getMemeImage() {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const randomNumber = Math.floor(Math.random() * allMemes.length);
      const url = allMemes[randomNumber].url;
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      setMeme((prevMeme) => ({
        ...prevMeme,
        randomImage: url,
        texts: [] // Reset texts when changing image
      }));
    } catch (error) {
      console.error("Failed to get meme image:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddText = () => {
    if (!currentText.trim()) return;
    if (editingTextIndex !== null) {
      // When editing, simply exit editing mode.
      setEditingTextIndex(null);
    } else {
      // Add a new text to the meme.
      setMeme((prevMeme) => ({
        ...prevMeme,
        texts: [
          ...prevMeme.texts,
          {
            content: currentText,
            position: { x: 50, y: 50 },
            fontSize: 24
          }
        ]
      }));
    }
    // Clear the input field after adding or confirming an edit.
    setCurrentText("");
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setCurrentText(value);
    // If editing an existing text, update its content live.
    if (editingTextIndex !== null) {
      setMeme((prevMeme) => {
        const updatedTexts = [...prevMeme.texts];
        updatedTexts[editingTextIndex] = {
          ...updatedTexts[editingTextIndex],
          content: value
        };
        return { ...prevMeme, texts: updatedTexts };
      });
    }
  };

  // Dragging logic for repositioning text on the meme image.
  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedTextIndex(index);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || draggedTextIndex === null) return;
    const rect = memeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMeme((prevMeme) => {
      const updatedTexts = [...prevMeme.texts];
      updatedTexts[draggedTextIndex] = {
        ...updatedTexts[draggedTextIndex],
        position: { x, y }
      };
      return { ...prevMeme, texts: updatedTexts };
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedTextIndex(null);
  };

  // When clicking a text, load its content into the input field for editing.
  const handleTextClick = (index) => {
    setEditingTextIndex(index);
    setCurrentText(meme.texts[index].content);
  };

  const handleRemoveText = (index) => {
    setMeme((prevMeme) => ({
      ...prevMeme,
      texts: prevMeme.texts.filter((_, i) => i !== index)
    }));
    if (editingTextIndex === index) {
      setEditingTextIndex(null);
      setCurrentText("");
    }
  };

  const captureMeme = async () => {
    if (!meme.randomImage) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = meme.randomImage;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Draw each text (overriding any forced uppercase)
        meme.texts.forEach((text) => {
          ctx.font = `bold ${Math.floor(canvas.width * (text.fontSize / 500))}px Impact`;
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.textAlign = "center";
          ctx.lineWidth = Math.floor(canvas.width * (text.fontSize / 5000));
          const x = canvas.width * (text.position.x / 100);
          const y = canvas.height * (text.position.y / 100);
          ctx.lineWidth = Math.floor(canvas.width * (text.fontSize / 5000));
          ctx.strokeText(text.content, x, y);
          ctx.fillText(text.content, x, y);
        });
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => {
        console.error("Failed to load image.");
        resolve(null);
      };
    });
  };

  const handleDownload = async () => {
    const dataUrl = await captureMeme();
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = dataUrl;
    link.click();
  };

  async function handleShare() {
    const dataUrl = await captureMeme();
    if (!dataUrl) return;
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "meme.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "Check out my meme!",
          text: "Created with Meme Generator"
        });
      } else {
        const shareUrl = URL.createObjectURL(blob);
        window.open(shareUrl, "_blank");
      }
    } catch (error) {
      console.error("Failed to share meme:", error);
    }
  }

  return (
    <main 
      className="grid-background"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="form glass">
        <div className="text-cont">
          <input
            type="text"
            placeholder="Type text here..."
            className="form--input"
            name="text"
            value={currentText}
            onChange={handleTextChange}
          />
          {/* Plus/Confirm button */}
          <button 
            title="Add text to meme"
            className="plus-btn"
            onClick={handleAddText}
            disabled={currentText.trim() === ""}
          >
            {currentText.trim() === "" ? <X size={20} /> : editingTextIndex !== null ? "" : <CircleCheck size={20} /> }
          </button>
        </div>
        <div className="button-group">
          <button
            className="form--button cta-2"
            onClick={handleDownload}
            disabled={isLoading}
          >
            Download Meme
          </button>
          <button
            className="form--button cta-1"
            onClick={getMemeImage}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading">Loading...</span>
            ) : (
              <>
                 New Meme Template
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 1.5L7.5 13.5M7.5 13.5L13.5 7.5M7.5 13.5L1.5 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
          <button
            className="form--button cta-3"
            onClick={handleShare}
            disabled={isLoading}
          >
            Share Meme
          </button>
        </div>
      </div>
      <div 
        className="meme" 
        ref={memeRef}
      >
        <div className={`meme--container ${isLoading ? "loading" : ""}`}>
          <img
            src={meme.randomImage}
            className={`meme--image ${isLoading ? "loading" : ""}`}
            alt="Meme"
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.src = fallBackImg;
              setIsLoading(false);
            }}
          />
          {meme.texts.map((text, index) => (
            <div 
              key={index}
              className="meme-text-wrapper"
              style={{
                left: `${text.position.x}%`, 
                top: `${text.position.y}%`,
              }}
              // Handle Shift + Scrollwheel to adjust font size
              onWheel={(e) => {
                if (e.shiftKey) {
                  e.preventDefault();
                  setMeme((prevMeme) => {
                    const updatedTexts = [...prevMeme.texts];
                    let newFontSize = updatedTexts[index].fontSize;
                    if (e.deltaY < 0) {
                      newFontSize += 2; // Increase font size
                    } else if (e.deltaY > 0) {
                      newFontSize = Math.max(8, newFontSize - 2); // Decrease font size, not below 8px
                    }
                    updatedTexts[index] = {
                      ...updatedTexts[index],
                      fontSize: newFontSize
                    };
                    return { ...prevMeme, texts: updatedTexts };
                  });
                }
              }}
            >
                <h2 
                className="meme--text"
                style={{
                    fontSize: `${text.fontSize}px`,
                    textTransform: "none", // Override forced uppercase
                    whiteSpace: "nowrap"   // Prevents text from wrapping
                }}
                onMouseDown={handleMouseDown(index)}
                onClick={() => handleTextClick(index)}
                >
                {text.content}
                {/* Render the remove (cross) button only when editing this text */}
                {editingTextIndex === index && (
                    <button 
                    className="remove-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveText(index);
                    }}
                    >
                    ✕
                    </button>
                )}
                </h2>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}