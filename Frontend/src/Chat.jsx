import "./Chat.css";
import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";

function Chat() {
    const { newChat, prevChats } = useContext(MyContext);
    
    console.log("Chat component - prevChats:", prevChats);

    return (
        <>
            {newChat && <h1>New Chat</h1>}
            
            <div className="chats">
                {prevChats && prevChats.length > 0 ? (
                    prevChats.map((chat, idx) => (
                        <div key={idx} className="chatItem">
                            {chat.role === "user" && (
                                <div className="userDiv">
                                    <p className="userMessage">{chat.content}</p>
                                </div>
                            )}
                            {chat.role === "assistant" && (
                                <div className="gemDiv">
                                    <p className="gemMessage">{chat.content}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="gemDiv">
                        <p className="gemMessage">Hello! How can I help you today?</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Chat;
