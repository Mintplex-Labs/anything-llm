import { useEffect, useState } from "react";
import AnythingLLMLogo from "./assets/anything-llm-dark.png";
import "./App.css";
import { v4 } from "uuid";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = v4();
      localStorage.setItem("userId", id);
    }

    setUserId(id);
  }, []);

  const toggleOpen = () => setIsOpen(!isOpen);

  const streamMessages = () => {
    const eventSource = fetchEventSource(
      `http://localhost:3001/api/workspace/${userId}/embedded-chat`
    );

    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
    });
  };

  const sendMessage = () => {
    console.log(message);
    fetch(`http://localhost:3001/api/workspace/${userId}/embedded-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-w-sm p-4 bg-white rounded-lg border shadow-lg"
            : "w-16 h-16 rounded-full"
        }`}
      >
        {isOpen && (
          <>
            <div className="flex justify-center">
              <img
                className="px-10"
                src={AnythingLLMLogo}
                alt="AnythingLLM Logo"
              />
            </div>
            <h1 className="text-md text-center font-semibold">
              Hello from Embedded App 👋
            </h1>
            <div className="card mt-4 p-4 bg-gray-100 rounded flex flex-col items-center justify-center">
              <div className="flex">
                <input
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message..."
                ></input>
                <button onClick={sendMessage}>Send message</button>
              </div>
            </div>
            <p className="mt-4 text-md text-blue-500 hover:text-opacity-30 text-center hover:cursor-pointer">
              Learn more
            </p>
          </>
        )}
        <button
          onClick={() => {
            toggleOpen();
            streamMessages();
          }}
          className={`absolute top-0 right-0 w-16 h-16 rounded-full ${
            isOpen ? "bg-white" : "bg-blue-500"
          }`}
          aria-label="Toggle Menu"
        >
          {isOpen ? "X" : "+"}
        </button>
      </div>
    </div>
  );
}

// import { useState } from 'react';
// import AnythingLLMLogo from './assets/anything-llm-dark.png';

// function App() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [count, setCount] = useState(0);
//   const [message, setMessage] = useState('');

//   const toggleOpen = () => setIsOpen(!isOpen);

//   const sendMessage = () => {
//     console.log(message);
//     fetch('http://localhost:3001/api/workspace/1/embedded-chat', {
//       method: 'POST',
//       body: JSON.stringify({
//         message: message,
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('Success:', data);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   }

//   const containerStyle = {
//     position: 'fixed',
//     bottom: '1rem',
//     right: '1rem',
//     zIndex: 50,
//     transition: 'all 300ms ease-in-out',
//     maxWidth: isOpen ? '20rem' : '4rem',
//     padding: isOpen ? '1rem' : '0',
//     backgroundColor: isOpen ? 'white' : 'transparent',
//     borderRadius: isOpen ? '0.5rem' : '9999px',
//     border: isOpen ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
//     boxShadow: isOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
//     width: isOpen ? 'auto' : '4rem',
//     height: isOpen ? 'auto' : '4rem',
//   };

//   const buttonStyle = {
//     padding: '0.5rem 1rem',
//     backgroundColor: '#3B82F6',
//     color: 'white',
//     borderRadius: '0.25rem',
//     transition: 'background-color 300ms',
//     cursor: 'pointer',
//   };

//   const toggleButtonStyle = {
//     position: 'absolute',
//     top: '0',
//     right: '0',
//     width: '4rem',
//     height: '4rem',
//     borderRadius: '9999px',
//     backgroundColor: isOpen ? 'white' : '#3B82F6',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '1.5rem',
//   };

//   const logoStyle = {
//     padding: isOpen ? '2.5rem' : '0',
//   };

//   const cardStyle = {
//     marginTop: '1rem',
//     padding: '1rem',
//     backgroundColor: '#F3F4F6',
//     borderRadius: '0.25rem',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//   };

//   const codeStyle = {
//     backgroundColor: '#E5E7EB',
//     borderRadius: '0.25rem',
//     padding: '0.25rem',
//   };

//   return (
//     <div style={containerStyle}>
//       {isOpen && (
//         <>
//           <div style={{ display: 'flex', justifyContent: 'center' }}>
//             <img style={logoStyle} src={AnythingLLMLogo} alt='AnythingLLM Logo' />
//           </div>
//           <h1 style={{ fontSize: '1.125rem', textAlign: 'center', fontWeight: '600' }}>Hello from Embedded App 👋</h1>
//           <div style={cardStyle}>
//             <button
//               onClick={() => setCount((count) => count + 1)}
//               style={buttonStyle}
//               onMouseEnter={() => (buttonStyle.backgroundColor = '#2563EB')}
//               onMouseLeave={() => (buttonStyle.backgroundColor = '#3B82F6')}
//             >
//               count is {count}
//             </button>
//             <p style={{ marginTop: '0.5rem' }}>
//               Edit <code style={codeStyle}>src/App.jsx</code> and save to test HMR
//             </p>
//             <div className='flex'>
//               <input onChange={(e) => setMessage(e.target.value)} placeholder='Enter a message...'></input>
//               <button onClick={sendMessage}>Send message</button>
//             </div>
//           </div>
//           <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#2563EB', textAlign: 'center', cursor: 'pointer', opacity: '0.5' }}>
//             Learn more
//           </p>
//         </>
//       )}
//       <button
//         onClick={toggleOpen}
//         style={toggleButtonStyle}
//         aria-label="Toggle Menu"
//       >
//         {isOpen ? 'X' : '+'}
//       </button>
//     </div>
//   );
// }

// export default App;

// Script to load the embedded-anything-llm.umd.js on page with <script></script>
// var script = document.createElement('script');
// script.src = 'http://localhost:5000/embedded-anything-llm.umd.js';
// script.onload = function() {
//     console.log('Script loaded successfully.');
// };
// script.onerror = function() {
//     console.error('An error occurred while loading the script.');
// };
// document.body.appendChild(script);

// SCRIPT TO LOAD THE EMBEDDED-ANYTHING-LLM.UMD.JS ON PAGE WITH <SCRIPT></SCRIPT>
// var script = document.createElement('script');
// script.src = 'http://localhost:5000/embedded-anything-llm.umd.js';
// document.head.appendChild(script);
