import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import fallBackImg from "/fallback-meme.jpg";

export default function Meme() {
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg",
    });
    const [allMemes, setAllMemes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
            await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
    
            const randomNumber = Math.floor(Math.random() * allMemes.length);
            const url = allMemes[randomNumber].url;
            setMeme((prevMeme) => ({
                ...prevMeme,
                randomImage: url,
            }));
        } catch (error) {
            console.error("Failed to get meme image:", error);
        } finally {
            setIsLoading(false);
        }
    }
    
    function handleChange(event) {
        const { name, value } = event.target;
        setMeme((prevMeme) => ({
            ...prevMeme,
            [name]: value,
        }));
    }

    const captureMeme = async () => {
        if (!meme.randomImage) return null;
    
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Fix CORS issues
            img.src = meme.randomImage;
    
            img.onload = () => {
                // Create a canvas
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
    
                // Set canvas dimensions to match the image
                canvas.width = img.width;
                canvas.height = img.height;
    
                // Draw the image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
                // Calculate font size dynamically (8% of image width)
                let fontSize = Math.floor(canvas.width * 0.08);
                ctx.font = `bold ${fontSize}px Impact`;
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.textAlign = "center";
                ctx.lineWidth = fontSize * 0.08; // Stroke thickness scales with font
    
                // Function to draw text with stroke
                const drawText = (text, x, y) => {
                    ctx.lineWidth = fontSize * 0.08; // Ensure stroke is visible
                    ctx.strokeText(text, x, y);
                    ctx.fillText(text, x, y);
                };
    
                // Top Text
                drawText(meme.topText.toUpperCase(), canvas.width / 2, fontSize);
    
                // Bottom Text (adjusted for padding)
                drawText(meme.bottomText.toUpperCase(), canvas.width / 2, canvas.height - fontSize / 2);
    
                // Convert to image data URL
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
                    text: "Created with Meme Generator",
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
        <main className="grid-background">
            <div className="form glass">
                <input
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <div className="button-group">
                    <button
                        className="form--button cta-1"
                        onClick={getMemeImage}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading">Loading...</span>
                        ) : (
                            <>
                                Get a new meme image
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
                        className="form--button cta-2"
                        onClick={handleDownload}
                        disabled={isLoading}
                    >
                        Download Meme
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
            <div className="meme" ref={memeRef}>
                <div className="meme--container">
                    <img
                        src={meme.randomImage}
                        className="meme--image"
                        alt="Meme"
                        crossOrigin="anonymous" // Ensures CORS support
                        onLoad={() => setIsLoading(false)}
                        onError={(e) => {
                            e.target.src = fallBackImg;
                            setIsLoading(false);
                        }}
                    />
                    <h2 className="meme--text top">{meme.topText}</h2>
                    <h2 className="meme--text bottom">{meme.bottomText}</h2>
                </div>
            </div>
        </main>
    );
}