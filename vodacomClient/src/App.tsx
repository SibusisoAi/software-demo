import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  textFieldClasses,
  Typography,
} from "@mui/material";
import botSvg from "./bot.svg";

function App() {
  // STATE
  const [initialResponse, setInitialResponse] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questionLog, setQuestionLog] = useState<
    Array<{ type: number; message: string }>
  >([{ type: 0, message: 'type your question below'}]);

  // HANDLERS
  const getInitialLoadData = useCallback(async (): Promise<void> => {
    try {
      const response: { message: string } = await fetch(
        "http://localhost:8000/vodacom/prompt"
      ).then((res) => res.json());
      setInitialResponse(response.message);
    } catch (err) {
      console.log(err);
    }
  }, []);

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
      setCurrentQuestion("");
      setResponse(response, question);
    } catch (err) {
      console.log(err);
    }
  };

  const setQuestion = (): Array<{ type: number, message: string }> => {
    const newLog = new Array();
    if (questionLog) newLog.push(...questionLog);
    newLog.push({ type: 1, message: currentQuestion });
    setQuestionLog(newLog);
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

  return (
    <Container
      disableGutters
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="example" style={{ height: "100%", width: "100%" }}>
        <Container
          className="example"
          disableGutters
          maxWidth={false}
          sx={{
            position: "relative",
            height: "100%",
            overflowY: "scroll",
            overflowX: "hidden",
            width: "100%",
            backgroundColor: "#EAEBED",
            padding: "20px",
            paddingBottom: '60px',
            marginBottom: "-56px",
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
                if (qVals.type === 0)
                  return (
                    <div key={idx}>
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
                  );
                else if (qVals.type === 1)
                  return (
                    <div key={idx}>
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
                  );
                return null;
              })
            : null}
        </Container>

        <TextField
          placeholder="Ask your question"
          fullWidth
          onKeyDown={(e: any) => (e.key === "Enter" ? askQuestion() : null)}
          sx={{
            backgroundColor: "white",
            borderWidth: "4px",
            outline: "red",
            "& .MuiOutlinedInput-notchedOutline": {
              ":hover": {},
              borderColor: "red",
              borderWidth: "2px",
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
      </div>
    </Container>
  );
}

export default App;
