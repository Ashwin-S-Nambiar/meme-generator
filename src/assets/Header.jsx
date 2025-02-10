import React from "react";

export default function Header() {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Meme Generator",
                    text: "Check out this Meme Generator!",
                    url: window.location.href,
                });
                console.log("Successfully shared!");
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            alert("Sharing is not supported on this browser.");
        }
    };

    return (
        <header className="header">
            <div className="header--content">
                <div className="header--logo-section">
                    <img 
                        src="/meme.svg" 
                        className="header--image"
                        alt="Meme Pic"
                    />
                    <h2 className="header--title">Meme Generator</h2>
                </div>
                <nav className="header--nav">
                    <button onClick={handleShare} className="glass-button">
                        Share
                    </button>
                </nav>
            </div>
        </header>
    );
}
