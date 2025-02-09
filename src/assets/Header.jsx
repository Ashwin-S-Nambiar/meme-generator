import React from "react"

export default function Header() {
    return (
        <header className="header">
            <div className="header--content">
                <div className="header--logo-section">
                    <img 
                        src="/troll-face.png" 
                        className="header--image"
                        alt="Troll Face"
                    />
                    <h2 className="header--title">Meme Generator</h2>
                </div>
                <nav className="header--nav">
                    <a href="#" className="nav-link">Create</a>
                    <a href="#" className="nav-link">Gallery</a>
                    <a href="#" className="glass-button">Share</a>
                </nav>
            </div>
        </header>
    )
}