import { useEffect, useState } from "react";
import "./timer.css";
import { MdOutlineNotStarted } from "react-icons/md";
import { IoIosPause } from "react-icons/io";
import { FaRegStopCircle } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import { FaRegLightbulb } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { TiArrowUpThick } from "react-icons/ti";
import { Howl } from "howler";
import soundNote from "../../assets/notification.mp3";
import stopSound from "../../assets/stop-sound.mp3";

export const Timer = () => {
  //Toggle para o light/dark mode
  const [lightMode, setLightMode] = useState(true);

  //Toggle para o indicador visual de work e break
  const [isTimeToWorkForArrow, setIsTimeToWorkForArrow] = useState(true);

  //Horas e minutos exibidos na Parabenização
  const [hoursCongrats, setHoursCongrats] = useState(0);
  const [minutesCongrats, setMinutesCongrats] = useState(0);
  const [secondsCongrats, setSecondsCongrats] = useState(0);

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
        setSecondsCongrats(secondsCongrats + 1); //aumentar 1 segundo no tempo geral
        //console.log(paralelWorkTimer);

        //se o contador paralelo do work, for negativo, começar o contador paralelo do break
        if (paralelWorkTimer < 0) {
          setParalelBreakTimer(paralelBreakTimer - 1);
        }

        //Ifs de atualizaçao do contador do tempo geral
        if (secondsCongrats === 59) {
          setMinutesCongrats(minutesCongrats + 1); //setar os minutos
          setSecondsCongrats(0);
        }

        if (minutesCongrats === 59) {
          setHoursCongrats(hoursCongrats + 1); //setar as horas
          setMinutesCongrats(0);
        }

        // console.log(`Segundos: ${secondsCongrats}`)
        // console.log(`Minutos: ${minutesCongrats}`)
        // console.log(`Horas: ${hoursCongrats}`)
      }, 1000);
    }

    //Se o work timer for maior que 0, a barra de progresso será de work
    if (paralelWorkTimer > 0) {
      setProgressState(workProgressPercentage);
      setIsTimeToWorkForArrow(true);
    }

    //Se o work timer for menor que 0 (significando que é break time), a barra de progresso será de break
    if (paralelWorkTimer < 0) {
      setProgressState(breakProgressPercentage);
      setIsTimeToWorkForArrow(false);
    }

    //Quando o timer paralelo do Work chegar a 0, começar o break
    if (paralelWorkTimer === 0) {
      setTotalTimeInSeconds(breakInSeconds); //Começar o Break time
      //console.log(`break`);
      if (isMounted) {
        const notificationSound = new Howl({
          src: [soundNote],
        });
        notificationSound.play();
      }
      
    }

    //Quando o timer paralelo do Break chegar a 0, recomeçar o timer do work
    if (paralelBreakTimer === 1) {
      setTotalTimeInSeconds(workInSeconds); //Começar o Work time
      setParalelWorkTimer(workInSeconds); //Recomeçar o work timer paralelo
      setParalelBreakTimer(breakInSeconds); //Recomeçar o break timer paralelo
      if (isMounted) {
        const notificationSound = new Howl({
          src: [soundNote],
        });
        notificationSound.play();
      }
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
    setMinutesCongrats(0);
    setHoursCongrats(0);
    setSecondsCongrats(0);
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

    const notificationStopSound = new Howl({
      src: [stopSound],
    });
    notificationStopSound.play();
    // setIsTimeToWorkForArrow(true);
  }
  //------------------------------------------------------------
  //Para lidar com o click dos botoes light/dark mode
  function handleSwitchModeButtons(event) {
    event.preventDefault();
    setLightMode(!lightMode);
  }

  //------------------------------------------------------------
  return (
    <main className={`${lightMode ? "light" : "dark"}`}>
      <div className={`container ${lightMode ? "light" : "dark"}`}>
        <div className="titleAndSwitchWrapper">
          <h1>OnFocus</h1>
          <div className="switchThemeMode">
            <button
              className="lightDarkModeButton"
              onClick={(e) => handleSwitchModeButtons(e)}
            >
              {lightMode ? <FaLightbulb /> : <FaRegLightbulb />}
            </button>
          </div>
        </div>
        <section className="menuOptions">
          <form>
            <div>
              <label htmlFor="workTime">Focus </label>
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
          <div
            className={`arrow ${
              isTimeToWorkForArrow ? "translateLeft" : "translateRight"
            }`}
          >
            <TiArrowUpThick />
          </div>
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
            Você focou por {hoursCongrats}hs e {minutesCongrats}m
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
            <MdOutlineNotStarted />
          </button>
          <button
            onClick={(event) => {
              handlePauseClick(event);
            }}
            style={{ display: `${areWorking ? "flex" : "none"}` }}
            className="pauseButton"
          >
            {isMounted ? <IoIosPause /> : <FaPlay />}
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
        <footer>
          <span>
            Feito por
            <a href="" target="_blank">
              Bruno Gomes
            </a>
          </span>
        </footer>
      </div>
    </main>
  );
};
