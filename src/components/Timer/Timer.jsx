import { useEffect, useState } from "react";
import "./timer.css";
import { MdOutlineNotStarted } from "react-icons/md";
import { IoIosPause } from "react-icons/io";
import { FaRegStopCircle } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";




export const Timer = () => {
  //Horas e minutos exibidos na Parabenização
  const [hoursCongrats, setHoursCongrats] = useState(0);
  const [minutesCongrats, setMinutesCongrats] = useState(0);
  const [totalMinutesCongrats, setTotalMinutesCongrats] = useState(0);

  //Toggle que vai definir a exibição do congrats
  const [congratsIsMounted, setCongratsIsMounted] = useState(false);

  //Estado paralelo do timer do work
  const [paralelWorkTimer, setParalelWorkTimer] = useState(0);

  //Estado paralelo do timer do break
  const [paralelBreakTimer, setParalelBreakTimer] = useState(0);

  //Toggle que vai definir o funcionamento do Timer
  const [isMounted, setIsMounted] = useState(false);

  //Toggle que vai definir se os botoes de pause e stop estarao habilitados
  const [pauseStopToggle, setPauseStopToggle] = useState(false);

  //Toggle que vai vai definir se uma sessao está em andamento
  const [areWorking, setAreWorking] = useState(false);

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
  let workProgressPercentage =
    (((totalTimeInSeconds - workInSeconds) * -1) / workInSeconds) * 100;

  let breakProgressPercentage =
    (((totalTimeInSeconds - breakInSeconds) * -1) / breakInSeconds) * 100;

  //------------------------------------------------------------
  //use effect para atualizar o timer com o tempo de trabalho
  useEffect(() => {
    //intervalId:
    let interval;

    //Quando o contador chegar a 0, desmontar o componente
    if (totalTimeInSeconds < 0) {
      setIsMounted(false);
      return;
    }

    //a cada 1s vai executar a funçao, mas só se isMounted for true
    if (totalTimeInSeconds !== 0 && isMounted) {
      interval = setInterval(() => {
        setTotalTimeInSeconds(totalTimeInSeconds - 1);
        setParalelWorkTimer(paralelWorkTimer - 1);
        setMinutesCongrats(60 - minutes);
        //console.log(paralelWorkTimer);

        //se o contador paralelo do work, for negativo, começar o contador paralelo do break
        if (paralelWorkTimer < 0) {
          setParalelBreakTimer(paralelBreakTimer - 1);
          //console.log(paralelBreakTimer);
        }
      }, 1);
    }

    //Se o work timer for maior que 0, a barra de progresso será de work
    if (paralelWorkTimer > 0) {
      setProgressState(workProgressPercentage);
    }

    //Se o work timer for menor que 0 (significando que é break time), a barra de progresso será de break
    if (paralelWorkTimer < 0) {
      setProgressState(breakProgressPercentage);
    }

    //Quando o timer paralelo do Work chegar a 0, começar o break
    if (paralelWorkTimer === 0) {
      setTotalTimeInSeconds(breakInSeconds); //Começar o Break time
      //console.log(`break`);
      setTotalMinutesCongrats(totalMinutesCongrats + workInMinutes);
    }

    //Sempre que acumular 60m em minutesCongrats atualizar as outras variaveis
    if (totalMinutesCongrats === 60) {
      setHoursCongrats(hoursCongrats + 1);

      console.log(hoursCongrats);
      setTotalMinutesCongrats(0);
    }

    //Quando o timer paralelo do Break chegar a 0, recomeçar o timer do work
    if (paralelBreakTimer === 1) {
      setTotalTimeInSeconds(workInSeconds); //Começar o Work time
      setParalelWorkTimer(workInSeconds); //Recomeçar o work timer paralelo
      setParalelBreakTimer(breakInSeconds); //Recomeçar o break timer paralelo
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
    setTotalTimeInSeconds(workInSeconds); //Iniciar o contador
    setIsMounted(true); //Iniciar o funcionamento do Timer
    setParalelWorkTimer(workInSeconds); //Iniciar o contador paralelo (work)
    setParalelBreakTimer(breakInSeconds); //Iniciar o contador paralelo (break)
    setCongratsIsMounted(false); //Para nao exibir o congrats
    setPauseStopToggle(true); //Para exibir os botoes de stop e pause
    setAreWorking(true); //Para indicar o inicio da sessao

    //Para limpar qualquer valor anterior do congrats
    setTotalMinutesCongrats(0) 
    setMinutesCongrats(0)
    setHoursCongrats(0)
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
    setCongratsIsMounted(true); //Para exibir o congrats
    setPauseStopToggle(false);
    setAreWorking(false);
  }

  //------------------------------------------------------------
  return (
    <main className="container">
      <h1>OnFocus</h1>
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
      <section
        className="congratsWrapper"
        style={{ visibility: `${congratsIsMounted ? "" : "hidden"}` }}
      >
        <h2>Parabéns!</h2>
        <p>
          Você trabalhou por {hoursCongrats}hs e {minutesCongrats}m
        </p>
      </section>
      <section className="buttonWrapper">
        <button
          onClick={(event) => {
            handleStartClick(event);
          }}
          disabled={workInMinutes <= 0 || breakInMinutes <= 0 ? true : false}
          style={{ display: `${!areWorking ? "flex" : "none"}` }}
          className="startButton"
          
        >
          
          <MdOutlineNotStarted/>
        </button>
        <button
          onClick={(event) => {
            handlePauseClick(event);
          }}
          style={{ display: `${areWorking ? "flex" : "none"}` }}
          className="pauseButton"
        >
          {isMounted ? <IoIosPause /> :  <FaPlay />
}
        </button>
        <button
          onClick={(event) => {
            handleStopClick(event);
          }}
          style={{ display: `${areWorking ? "flex" : "none"}` }}
          className="stopButton"
        >
          <FaRegStopCircle />

        </button>
      </section>
    </main>
  );
};
