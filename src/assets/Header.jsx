import React, { useState } from "react";
import { X } from "lucide-react";

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    
        if (!isModalOpen) {
            document.documentElement.style.overscrollBehavior = "contain";
            document.documentElement.style.touchAction = "none";
        } else {
            document.documentElement.style.overscrollBehavior = "";
            document.documentElement.style.touchAction = "";
        }
    };
    
    return (
        <>
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
                        <button 
                            title="Check instructions"
                            onClick={toggleModal}
                            className="glass-button border-animate"
                        >
                            Instructions
                        </button>
                        <button 
                            title="Share this app" 
                            onClick={handleShare} 
                            className="glass-button"
                        >
                            Share
                        </button>
                    </nav>
                </div>
            </header>

            <div className={`modal-container ${isModalOpen ? 'open' : ''}`}>
                <div 
                    className="modal-backdrop"
                    onClick={toggleModal}
                />
                
                <div className="modal-content">
                    <div className="modal-grid-background" />
                    
                    <button 
                        aria-label="close instructions model"
                        onClick={toggleModal}
                        className="modal-close"
                    >
                        <X size={20} />
                    </button>

                    <div className="modal-inner">
                        <h3 className="modal-title">
                            How to Use the Meme Generator
                        </h3>
                        
                        <div className="instructions-list">
                            <div className="instruction-item">
                                <div className="instruction-number instruction-number-1">1</div>
                                <p className="instruction-text">
                                    Choose a meme template from our collection of popular meme templates.
                                </p>
                            </div>

                            <div className="instruction-item">
                                <div className="instruction-number instruction-number-2">2</div>
                                <p className="instruction-text">
                                    You can change the template by clicking the New Meme Template button, add your own custom texts to the image.
                                </p>
                            </div>

                            <div className="instruction-item">
                                <div className="instruction-number instruction-number-3">3</div>
                                <p className="instruction-text">
                                    On PCs: Drag the custom text with your mouse to change it's placement, On mobile: Touch and hold to move it.
                                </p>
                            </div>

                            <div className="instruction-item">
                                <div className="instruction-number instruction-number-4">4</div>
                                <p className="instruction-text">
                                    On PCs: <div className="controls">
                                                <span>Shift</span>
                                                <span>Scrl Up/Down</span>
                                            </div> 
                                     to adjust font size, On mobile: Pinch in/out to adjust the font size of the text.
                                </p>
                            </div>

                            <div className="instruction-item">
                                <div className="instruction-number instruction-number-1">5</div>
                                <p className="instruction-text">
                                    Download your meme or share it directly using the call to action buttons.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}