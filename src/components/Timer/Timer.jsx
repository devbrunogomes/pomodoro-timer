import { useEffect, useState } from "react";
import "./timer.css";

export const Timer = () => {
  //Estado paralelo do timer do work
  const [paralelWorkTimer, setParalelWorkTimer] = useState(0)

  //Estado paralelo do timer do break
  const [paralelBreakTimer, setParalelBreakTimer] = useState(0)

  //Toggle que vai definir o funcionamento do Timer
  const [isMounted, setIsMounted] = useState(false);

  //tempo de trabalho em minutos
  const [workInMinutes, setWorkInMinutes] = useState(0);
  let workInSeconds = workInMinutes * 60;

  //tempo de descanso em minutos
  const [breakInMinutes, setBreakInMinutes] = useState(0);
  const breakInSeconds = breakInMinutes * 60;

  //Tempo em segundos para o relógio
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;

  //Barra de loading
  const [progressState, setProgressState] = useState(0);
  let progressPercentage =
    (((totalTimeInSeconds - workInSeconds) * -1) / workInSeconds) * 100;
  
  //------------------------------------------------------------
  //use effect para atualizar o timer com o tempo de trabalho
  useEffect(() => {
    //intervalId:
    let interval;    

    //Quando o contador chegar a 0, desmontar o componente
    if (totalTimeInSeconds === 0) {
      setIsMounted(false);
      return;
    }

    //a cada 1s vai executar a funçao, mas só se isMounted for true
    if (totalTimeInSeconds !== 0 && isMounted) {
      interval = setInterval(() => {
        setTotalTimeInSeconds(totalTimeInSeconds - 1);       
        setParalelWorkTimer(paralelWorkTimer - 1)
        console.log(paralelWorkTimer)

        //se o contador paralelo do work, for negativo, começar o contador paralelo do break
        if (paralelWorkTimer < 1) {
          setParalelBreakTimer(paralelBreakTimer - 1)
          console.log(paralelBreakTimer)
        }

        setProgressState(progressPercentage);
      }, 1000);
    }

    //Quando o timer paralelo do Work chegar a 0, começar o break
    if (paralelWorkTimer === 1) {
      setTotalTimeInSeconds(breakInSeconds)
    }

    //Quando o timer paralelo do Break chegar a 0, recomeçar o timer do work
    if (paralelBreakTimer === 2) {
      setTotalTimeInSeconds(workInSeconds)
      setParalelWorkTimer(workInSeconds)
      setParalelBreakTimer(breakInSeconds)
    }
    
    //Saída da funçao limpando o intervalo, cancelando a renderizacao
    return () => clearInterval(interval);
  }, [isMounted, totalTimeInSeconds]);
  //------------------------------------------------------------
  //Para lidar com a mudança dos valores do inputs
  function handleInputChange(event, setStateFunction) {
    const inputValue = event.target.value;

    setStateFunction(parseInt(inputValue, 10) || 0);
  }
  //------------------------------------------------------------
  //Para lidar com o click do botao start
  function handleStartClick(event) {
    event.preventDefault();
    console.log(breakInMinutes);
    setTotalTimeInSeconds(workInSeconds);
    setIsMounted(true);
    setParalelWorkTimer(workInSeconds)
    setParalelBreakTimer(breakInSeconds)
  }
  //------------------------------------------------------------
  //Para lidar com click do botao pause
  function handlePauseClick(event) {
    event.preventDefault();
    setIsMounted(!isMounted);
  }
  //------------------------------------------------------------
  //Para lidar com click do botao stop
  function handleStopClick(event) {
    event.preventDefault();
    setIsMounted(false);
    setTotalTimeInSeconds(0);
    setProgressState(0);
  }

  //------------------------------------------------------------
  return (
    <main className="container">
      <h1>Pomodoro</h1>
      <section className="menuOptions">
        <form>
          <div>
            <label htmlFor="workTime">Work </label>
            <input
              min={1}
              max={60}
              disabled={isMounted}
              placeholder="min"
              type="number"
              name="timeToWork"
              id="workTime"
              onChange={(e) => handleInputChange(e, setWorkInMinutes)}
              required
            />
          </div>
          <div>
            <label htmlFor="breakTime">Break</label>
            <input
              disabled={isMounted}
              placeholder="min"
              type="number"
              name="timeToBreak"
              id="breakTime"
              onChange={(e) => handleInputChange(e, setBreakInMinutes)}
              required
            />
          </div>
        </form>
      </section>
      <section className="timerAndProgressWrapper">
        <div className="relogio">
          <p>{minutes < 10 ? `0${minutes}` : minutes}</p>
          <p>:</p>
          <p>{seconds < 10 ? `0${seconds}` : seconds}</p>
        </div>

        <div className="total">
          <div
            className="progress"
            style={{ width: `${100 - progressState}%` }}
          ></div>
        </div>
      </section>
      <section className="buttonWrapper">
        <button
          onClick={(event) => {
            handleStartClick(event);
          }}
        >
          {isMounted ? "RESTART" : "START"}
        </button>
        <button
          onClick={(event) => {
            handlePauseClick(event);
          }}
        >
          PAUSE
        </button>
        <button
          onClick={(event) => {
            handleStopClick(event);
          }}
        >
          STOP
        </button>
      </section>
    </main>
  );
};
