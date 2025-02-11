import { useEffect } from "react";
import Header from "./assets/Header.jsx";
import Meme from "./assets/Meme.jsx";
import Footer from "./assets/Footer.jsx";

export default function App() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>  
            <main>
                <Header /> 
                <Meme />
                <Footer />
            </main>
        </>
    );
}