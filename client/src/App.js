import { React, useState, useEffect } from "react";
import io from "socket.io-client";
import styles from "./App.module.css";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";

function App() {
  //socket

  let socketConnection = io("http://localhost:3001");

  //local states

  //before login
  const [loggedUser, setLoggedUser] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorHandler, setErrorHandler] = useState({});

  //after login
  const [room, setRoom] = useState("");
  const [socket, setSocket] = useState(socketConnection);
  const [roomStarted, setRoomStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //useEffects

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setAllMessages([...allMessages, data]);
    });
    console.log("entre aca");
  }, [allMessages]);

  // useEffect(() => {
  //   socket.on("recieved_message", (data) => {
  //     console.log(data);
  //   });
  // }, [allMessages]);

  //functions

  function handleChange(event) {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  }

  function loginChecker(e) {
    e.preventDefault();
    let errorCheckerLogin = errorLogin(userData);

    if (Object.keys(errorCheckerLogin).length === 0) {
      setLoggedUser(true);
    } else {
      setErrorHandler(errorCheckerLogin);
    }
  }

  function startRoom(e) {
    e.preventDefault();
    let errorCheckerRoom = errorRoom(room);

    if (Object.keys(errorCheckerRoom).length === 0) {
      socket.emit("join_room", room);
      setRoomStarted(true);
    } else {
      setErrorHandler(errorCheckerRoom);
    }
  }

  async function sendMessages() {
    if (message.length !== 0) {
      let messageContent = {
        room: room,
        content: { author: userData.name, message: message },
      };
      await socket.emit("send_message", messageContent);
      setAllMessages([...allMessages, messageContent.content]);
      setMessage("");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.title}>
        <h1>Welcome to my chat app!</h1>
      </header>
      <div className={styles.body}>
        {!loggedUser && (
          <h3
            style={{
              color: "white",
              margin: "20px",
              backgroundColor: "#2a3d50",
              padding: "20px",
              borderRadius: "7px",

              display: "flex",
              alignItems: "center",
            }}
          >
            Log here!
            <AiOutlineArrowDown
              style={{
                alignText: "center",
                margin: "0",
              }}
            />
          </h3>
        )}
        {!roomStarted ? (
          <div className={styles.header}>
            {!loggedUser ? (
              <div className={styles.login}>
                <form onSubmit={(e) => loginChecker(e)}>
                  <div className={styles.leftData}>
                    <input
                      className={styles.name}
                      name="name"
                      value={userData.name}
                      type="text"
                      placeholder="name..."
                      onChange={(e) => handleChange(e)}
                    />
                    {errorHandler.name ? (
                      <h5 style={{ color: "rgb(117, 0, 0)" }}>
                        {errorHandler.name}
                      </h5>
                    ) : (
                      <h5 style={{ color: "rgb(117, 0, 0)" }}>
                        {errorHandler.name}
                      </h5>
                    )}
                    <div className={styles.password}>
                      <input
                        name="password"
                        value={userData.password}
                        type={showPassword ? "text" : "password"}
                        placeholder="password..."
                        onChange={(e) => handleChange(e)}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                      </button>
                    </div>
                    {errorHandler.password ? (
                      <h5 style={{ color: "rgb(117, 0, 0)", opacity: "1" }}>
                        {errorHandler.password}
                      </h5>
                    ) : (
                      <h5 style={{ color: "rgb(117, 0, 0)", opacity: "0" }}>
                        {errorHandler.password}
                      </h5>
                    )}
                  </div>
                  <div className={styles.rightData}>
                    <button style={{ width: "60px" }} type="submit">
                      {" "}
                      Sign in{" "}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <header
                  className={styles.title}
                  style={{ margin: "25px", fontSize: "18px", padding: "10px" }}
                >
                  Welcome {userData.name} ! Here you can write a room to chat
                  with your friends!{" "}
                </header>
                <div className={styles.logged}>
                  <form>
                    <div className={styles.leftData}>
                      <input
                        type="text"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                      />
                    </div>
                    <div className={styles.passwordLogged}>
                      <button type="submit" onClick={(e) => startRoom(e)}>
                        Join Room!
                      </button>
                    </div>
                  </form>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {errorHandler.room && (
                      <h5 style={{ color: "rgb(117, 0, 0)" }}>
                        {errorHandler.room}
                      </h5>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={styles.chatConteiner}>
            <div className={styles.chatHeader}> Welcome to {room}'s room </div>
            <div className={styles.chat}>
              {allMessages !== undefined && allMessages.length !== 0
                ? allMessages.map((e, i) => {
                    console.log(e);
                    return (
                      <div className={styles.messageContainer} key={i}>
                        <h3
                          className={
                            e.author === userData.name
                              ? styles.you
                              : styles.otherPerson
                          }
                        >
                          <div
                            style={{
                              color: "white",
                              display: "flex",
                              justifyContent: "flex-start",
                              fontWeight: "lighter",
                            }}
                          >
                            {e.author}
                          </div>{" "}
                          <div style={{ color: "#2a3d50" }}>{e.message}</div>
                        </h3>
                      </div>
                    );
                  })
                : null}
            </div>
            <div className={styles.chatData}>
              <input
                value={message}
                type="text"
                placeholder="message..."
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessages}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function errorLogin(error) {
  var responseError = {};

  if (!error.name) {
    responseError.name = "*you need a name!*";
  }
  if (!error.password) {
    responseError.password = "*you need a password! (not really here but...)*";
  }

  return responseError;
}

function errorRoom(room) {
  var responseError = {};

  if (room === "") {
    responseError.room = "*you have to insert a room!*";
  }
  return responseError;
}

export default App;
