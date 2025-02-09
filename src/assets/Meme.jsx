import React from "react"

export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg" 
    })
    const [allMemes, setAllMemes] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)
    
    React.useEffect(() => {
        async function fetchMemes() {
            try {
                const res = await fetch("https://api.imgflip.com/get_memes")
                const data = await res.json()
                setAllMemes(data.data.memes)
            } catch (error) {
                console.error("Failed to fetch memes:", error)
            }
        }
        fetchMemes()
    }, [])
    
    async function getMemeImage() {
        setIsLoading(true)
        try {
            const randomNumber = Math.floor(Math.random() * allMemes.length)
            const url = allMemes[randomNumber].url
            setMeme(prevMeme => ({
                ...prevMeme,
                randomImage: url
            }))
        } catch (error) {
            console.error("Failed to get meme image:", error)
        } finally {
            setIsLoading(false)
        }
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
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
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading">Loading...</span>
                    ) : (
                        <>
                            Get a new meme image 
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 1.5L7.5 13.5M7.5 13.5L13.5 7.5M7.5 13.5L1.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </>
                    )}
                </button>
            </div>
            <div className="meme">
                <div className="meme--container">
                    <img 
                        src={meme.randomImage} 
                        className="meme--image"
                        alt="Meme"
                        onLoad={() => setIsLoading(false)}
                        onError={(e) => {
                            e.target.src = "fallback-meme.jpg"
                            setIsLoading(false)
                        }}
                    />
                    <h2 className="meme--text top">{meme.topText}</h2>
                    <h2 className="meme--text bottom">{meme.bottomText}</h2>
                </div>
            </div>
        </main>
    )
}