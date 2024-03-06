import { useState } from "react";
import "./timer.css";

export const Timer = () => {
  const [workInSeconds, setWorkInSeconds] = useState(0)
  const [breakInSeconds, setBreakInSeconds] = useState(0)

  return (
    <main className="container">
      <nav className="menu">
        <form>
          <label htmlFor="workTime">Work</label>
          <input type="number" name="timeToWork" id="workTime" />
          <label htmlFor="breakTime">Break</label>
          <input type="number" name="timeToBreak" id="breakTime" />
          <button>START</button>
        </form>
      </nav>
      <section>
        <div className="relogio">
          <span>16</span>
          <span>:</span>
          <span>00</span>
        </div>

        <div className="total">
          <div className="progress" style={{ width: `60%` }}></div>
        </div>
      </section>
    </main>
  );
};
