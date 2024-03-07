import { useEffect, useState } from "react";
import "./timer.css";

export const Timer = () => {
  //Toggle que vai definir o funcionamento do Timer
  const [isMounted, setIsMounted] = useState(false);  

  //tempo de trabalho em minutos
  const [workInMinutes, setWorkInMinutes] = useState(0);
  const workInSeconds = workInMinutes * 60;

  //tempo de descanso em minutos
  const [breakInMinutes, setBreakInMinutes] = useState(0);

  //Tempo em segundos para o relógio
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;

  //Barra de loading
  const [progressState, setProgressState] = useState(0)
  //------------------------------------------------------------
  useEffect(() => {
    //intervalId:
    let interval;

    let progressPercentage = ((totalTimeInSeconds - workInSeconds) * -1) / workInSeconds * 100
    

    //Quando o contador chegar a 0, desmontar o componente
    if (totalTimeInSeconds === 0) {
      setIsMounted(false)
      return;
    }
    //a cada 1s vai executar a funçao, mas só se isMounted for true
    if (totalTimeInSeconds !== 0 && isMounted) {
      interval = setInterval(() => {
        setTotalTimeInSeconds(totalTimeInSeconds - 1);

        setProgressState(progressPercentage)
      }, 1000);
    }    

    //Saída da funçao limpando o intervalo, cancelando a renderizacao
    return () => clearInterval(interval);    
  }, [isMounted, totalTimeInSeconds]);
  //------------------------------------------------------------
  //Para lidar com a mudança dos valores
  function handleInputChange(event, setStateFunction) {
    const inputValue = event.target.value;
    
    setStateFunction(parseInt(inputValue, 10) || 0);
  }
  //------------------------------------------------------------
  //Para lidar com o click do botao start
  function handleStartClick(event) {
    event.preventDefault();

    setTotalTimeInSeconds(workInSeconds);
    setIsMounted(true);
  }
  //------------------------------------------------------------
  //Para lidar com click do botao pause
  function handlePauseClick(event) {
    event.preventDefault();
    setIsMounted(!isMounted);
    console.log(isMounted);
  }
  //------------------------------------------------------------
  function handleStopClick(event) {
    event.preventDefault();  
    setIsMounted(false)  
    setTotalTimeInSeconds(0)
    
  }

  //------------------------------------------------------------
  return (
    <main className="container">
      <nav className="menu">
        <form>
          <label htmlFor="workTime">Work</label>
          <input
            type="number"
            name="timeToWork"
            id="workTime"
            onChange={(e) => handleInputChange(e, setWorkInMinutes)}
          />
          <label htmlFor="breakTime">Break</label>
          <input
            type="number"
            name="timeToBreak"
            id="breakTime"
            onChange={(e) => handleInputChange(e, setBreakInMinutes)}
          />
          
        </form>
      </nav>
      <section>
        <div className="relogio">
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
          <span>:</span>
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
        </div>

        <div className="total">
          <div className="progress" style={{ width: `${progressState}%` }}></div>
        </div>
      </section>
      <section>
      <button
            onClick={(event) => {
              handleStartClick(event);
            }}
          >
            START
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
