import "./Sidebar.css";

function Sidebar() {
    return (
        <section className="Sidebar">
            <button>
                <img src="src/assets/gemini-icon.webp" alt="Gemini icon" className="logo"/>
                <span className="icon"><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                <li>thread1</li>
                <li>thread2</li>
                <li>thread3</li>
            </ul>

            <div className="sign">
                by Gaurav Patil &hearts;
            </div>
        </section>
    )
}

export default Sidebar;