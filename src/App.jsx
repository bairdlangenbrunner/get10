import { useState, useEffect } from "react";
import Die from "./components/Die";
import ReactConfetti from "react-confetti";

function App() {
  // timing states
  const [gameIsStarted, setGameIsStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);

  // roll, win, dice states
  const [rollCount, setRollCount] = useState(1);
  const [dice, setDice] = useState(() => generateNewDiceObjects());

  // high scores
  // const [highScores, setHighScores] = useState([
  //   { name: "someone", time: 13.02, rolls: 12 },
  //   { name: "Baird", time: 17.62, rolls: 19 },
  //   { name: "braid", time: 18.09, rolls: 18 },
  // ]);

  // useEffect(() => {
  //   localStorage.setItem("highScores", JSON.stringify(highScores));
  // }, []);

  const gameWon =
    dice.every((die) => die.hold) &&
    dice.every((die) => die.number === dice[0].number);
  // check if the game is won whenever dice changes

  useEffect(() => {
    if (gameWon && startTime) {
      setElapsedTime(((new Date() - startTime) / 1000).toFixed(2));
      const rollButton = document.querySelector(".roll-button");
      rollButton.focus();
      const dieList = document.querySelectorAll('.die')
      // dieList.map(className)
    }
  }, [dice, gameWon, startTime]);

  function generateNewDiceObjects() {
    return new Array(10).fill(null).map(() => ({
      id: crypto.randomUUID(),
      number: 5, //Math.ceil(Math.random() * 6),
      hold: false,
    }));
  }

  // when you click a die, hold it
  // if it's the first die clicked, start timer
  function handleDieClick(id) {
    gameIsStarted ? setGameIsStarted(true) : setGameIsStarted(false);
    if (!startTime) {
      setStartTime(new Date());
    }
    setDice((prevDice) =>
      prevDice.map((die) => (die.id === id ? { ...die, hold: !die.hold } : die))
    );
  }
  // console.log(startTime)

  // roll the die
  // only change the ones that have hold=false
  // if the game has been won, roll dice button restarts it
  function handleRoll() {
    setRollCount((prevCount) => prevCount + 1);
    if (!gameWon) {
      setDice((prevDice) =>
        prevDice.map((die) =>
          die.hold ? die : { ...die, number: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      handleRestart();
    }
  }

  // restart game
  function handleRestart() {
    setDice(generateNewDiceObjects());
    setRollCount(1);
    // setGameWon(false);
    setGameIsStarted(false);
    setStartTime(null);
    setElapsedTime(null);
  }

  // create a bunch of <button> elements
  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.number}
      handleClick={() => handleDieClick(die.id)}
      hold={die.hold}
      gameWon={gameWon}
    />
  ));

  // core of app
  return (
    <>
      <main>
        <div className="title-div">
          <h1>get 10!</h1>
          <h2>a Tenzies ripoff</h2>
        </div>
        {gameWon && (
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
          />
        )}
        {/* <div aria-live="polite" className="sr-only">
          {gameWon && <p>you win! roll dice or press start to play again</p>}
        </div> */}
        <p className="instructions">
          <span style={{ fontWeight: "bold" }}>instructions:</span> roll until
          all dice are the same; click each die to freeze it as you progress
        </p>
        <div className="die-div">
          {diceElements}
          {gameWon && (
            <div className="win-popup-text">
              <span style={{ fontWeight: 900 }}>roll count: </span>
              {rollCount}
              <br />
              <span style={{ fontWeight: 900 }}>time: </span>
              {elapsedTime}s
            </div>
          )}
        </div>
        <button className="roll-button" onClick={handleRoll}>
          {gameWon ? "restart game" : "roll dice"}
        </button>

        <button
          className={`restart-button ${gameWon ? "visibility-hidden" : ""}`}
          onClick={handleRestart}
        >
          restart
        </button>
      </main>
    </>
  );
}
export default App;
