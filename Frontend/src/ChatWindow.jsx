import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import {MyContext} from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const getReply = async () => {
        if (!prompt.trim()) {
            return;
        }
        setLoading(true);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:3000/api/chat", options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const res = await response.json();
            console.log(res);

            setReply(res.reply);
            setLoading(false);
            setPrompt("");
        } catch(err) {
            console.log(err);
            setReply("An error occurred while fetching the reply. Please try again.");
        }
        
        setCurrThreadId(currThreadId); // Resetting the thread ID to maintain the current
    }

    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => ([
                ...prevChats,
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]))
        }

        setPrompt("");
    }, [reply])

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>TalkSpark <i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv">
                    <span><i className="fa-solid fa-circle-user"></i></span>
                </div>
            </div>

            <Chat></Chat>
             {loading && (
                <div style={{display: 'flex', justifyContent: 'center', padding: '20px'}}>
                    <ScaleLoader color="#fff" loading={loading} />
                </div>
            )}
            <div className="chatInput">
                <div className="userInput">
                    <input type="text" placeholder="Ask me anything..." 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            getReply();
                        }
                    }}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>

                <p className="info">
                    TalkSpark can make mistakes. Please verify the information before using it for any critical tasks.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;
