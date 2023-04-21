import React, { useRef, useEffect, useState } from "react";
import { Box, Container, Fade, TextField, Typography } from "@mui/material";
import botSvg from "./bot.svg";

function App() {
  // STATE
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [initialResponse, setInitialResponse] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questionLog, setQuestionLog] = useState<
    Array<{ type: number; message: string }>
  >([{ type: 0, message: "type your question below" }]);

  // HANDLERS
  const getInitialLoadData = async (): Promise<void> => {
    try {
      const response: { message: string } = await fetch(
        "http://localhost:8000/vodacom/prompt"
      ).then((res) => res.json());
      setInitialResponse(response.message);
    } catch (err) {
      console.log(err);
    }
  };

  const askQuestion = async (): Promise<void> => {
    try {
      const question = setQuestion();
      const response: { ai_response: string } = await fetch(
        "http://localhost:8000/vodacom/prompt",
        {
          body: JSON.stringify({ message: currentQuestion }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());
      setResponse(response, question);
    } catch (err) {
      console.log(err);
    }
  };

  const setQuestion = (): Array<{ type: number; message: string }> => {
    const newLog = new Array();
    if (questionLog) newLog.push(...questionLog);
    newLog.push({ type: 1, message: currentQuestion });
    setQuestionLog(newLog);
    setCurrentQuestion("");
    return newLog;
  };

  const setResponse = (response: { ai_response: string }, log: any) => {
    const newLogResponse = new Array();
    if (log) newLogResponse.push(...log);
    newLogResponse.push({ type: 0, message: response.ai_response });
    setQuestionLog(newLogResponse);
  };

  // LIFE CYCLE METHODS
  useEffect(() => {
    getInitialLoadData();
  }, []);

  useEffect(() => {
    if (lastMessageRef.current) lastMessageRef.current.focus();
  }, [questionLog, lastMessageRef]);

  return (
    <Container
      className="example"
      disableGutters
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent" /*#F2F2F3 */,
        paddingTop: "10px",
      }}
    >
      <Container
        className="example"
        disableGutters
        maxWidth="sm"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "transparent" /* #F2F2F3 */,
          marginTop: "10px",
        }}
      >
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            position: "relative",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Container
            className="example"
            disableGutters
            sx={{
              padding: "0 20px",
              overflowY: "scroll",
              paddingBottom: '10px',
              marginBottom: '80px'
            }}
          >
            <Box display="inline-flex" gap="15px">
              <img src={botSvg} style={{ zIndex: "-1px", width: "30px" }} />
              <Container
                disableGutters
                sx={{
                  backgroundColor: "#EE4342",
                  display: "inline-flex",
                  borderRadius: "5px",
                  position: "relative",
                  boxShadow:
                    "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                  ":before": {
                    content: '""',
                    position: "absolute",
                    width: 0,
                    height: 0,
                    top: "50%",
                    left: 0,
                    border: "10px solid transparent",
                    borderRightColor: "#EE4342",
                    borderLeft: 0,
                    marginTop: "-10px",
                    marginLeft: "-9px",
                  },
                }}
              >
                <Typography
                  sx={{
                    padding: "10px",
                  }}
                  color="white"
                >
                  {initialResponse}
                </Typography>
              </Container>
            </Box>

            <br />
            <br />

            {questionLog && questionLog.length
              ? questionLog.map((qVals, idx) => {
                  if (qVals.type === 0) {
                    return (
                      <Fade in={true} timeout={800} key={idx}>
                        <div
                          tabIndex={1}
                          style={{ outline: "none" }}
                          ref={
                            idx === questionLog.length - 1
                              ? lastMessageRef
                              : null
                          }
                        >
                          <Box display="inline-flex" gap="15px">
                            <img
                              src={botSvg}
                              style={{ zIndex: "-1px", width: "30px" }}
                            />
                            <Container
                              disableGutters
                              sx={{
                                backgroundColor: "#EE4342",
                                display: "inline-flex",
                                borderRadius: "5px",
                                position: "relative",
                                boxShadow:
                                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                                ":before": {
                                  content: '""',
                                  position: "absolute",
                                  width: 0,
                                  height: 0,
                                  top: "50%",
                                  left: 0,
                                  border: "10px solid transparent",
                                  borderRightColor: "#EE4342",
                                  borderLeft: 0,
                                  marginTop: "-10px",
                                  marginLeft: "-9px",
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  padding: "10px",
                                }}
                                color="white"
                              >
                                {qVals.message}
                              </Typography>
                            </Container>
                          </Box>

                          <br />
                          <br />
                        </div>
                      </Fade>
                    );
                  } else if (qVals.type === 1) {
                    return (
                      <Fade in={true} timeout={800} key={idx}>
                        <div
                          tabIndex={1}
                          style={{ outline: "none" }}
                          ref={
                            idx === questionLog.length - 1
                              ? lastMessageRef
                              : null
                          }
                        >
                          <Box
                            display="inline-flex"
                            width={"100%"}
                            justifyContent={"flex-end"}
                            gap="10px"
                          >
                            <Typography
                              sx={{
                                padding: "10px",
                                backgroundColor: "#A3BAC3",
                                borderRadius: "5px",
                                position: "relative",
                                boxShadow:
                                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                                ":after": {
                                  content: '""',
                                  position: "absolute",
                                  width: 0,
                                  height: 0,
                                  top: "50%",
                                  right: 0,
                                  border: "10px solid transparent",
                                  borderLeftColor: "#A3BAC3",
                                  borderRight: 0,
                                  marginTop: "-10px",
                                  marginRight: "-9px",
                                },
                              }}
                              color="white"
                            >
                              {qVals.message}
                            </Typography>
                          </Box>

                          <br />
                          <br />
                        </div>
                      </Fade>
                    );
                  }
                  return null;
                })
              : null}
          </Container>

          <Container
            disableGutters
            maxWidth="sm"
            sx={{
              width: "100%",
              backgroundColor: "transparent" /* #F2F2F3 */,
              zIndex: "50",
              position: "fixed",
              bottom: 0,
              padding: "15px",
            }}
          >
            <TextField
              placeholder="Ask your question here"
              fullWidth
              value={currentQuestion}
              size="small"
              onKeyDown={(e: any) => (e.key === "Enter" ? askQuestion() : null)}
              sx={{
                width: "100%",
                margin: 0,
                "& input": {
                  backgroundColor: "white",
                },
                outline: "red",
                "& .MuiOutlinedInput-notchedOutline": {
                  ":hover": {},
                  borderColor: "red",
                },
                "& .Mui-focused": {
                  borderColor: "red",
                },
                "&.MuiOutlinedInput-root": {
                  borderColor: "red",
                },
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCurrentQuestion(event.target.value);
              }}
            />
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

export default App;
