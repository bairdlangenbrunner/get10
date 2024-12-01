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
  const [gameWon, setGameWon] = useState(false);
  const [dice, setDice] = useState(generateNewDiceObjects());

  // check if the game is won whenever dice changes
  useEffect(() => {
    const allHeld = dice.every((die) => die.hold);
    const allSameNumber = dice.every((die) => die.number === dice[0].number);

    if (allHeld && allSameNumber) {
      setGameWon(true);
      setElapsedTime(((new Date() - startTime) / 1000).toFixed(2));
    }
  }, [dice, gameWon, startTime]);

  function generateNewDiceObjects() {
    return new Array(10).fill(null).map(() => ({
      id: crypto.randomUUID(),
      number: Math.ceil(Math.random() * 6),
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
  // if the game has been one, roll dice button restarts it
  function handleRoll() {
    setRollCount((prevCount) => prevCount + 1);
    if (!gameWon) {
      setDice((prevDice) =>
        prevDice.map((die) =>
          die.hold ? die : { ...die, number: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      setDice(generateNewDiceObjects());
      setRollCount(1);
    }
  }

  // restart game
  function handleRestart() {
    setDice(generateNewDiceObjects());
    setRollCount(1);
    setGameWon(false);
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
        <div aria-live="polite" className="sr-only">
          {gameWon && <p>you win! roll dice or press start to play again</p>}
        </div>
        {/* <p>a ripoff of Tenzies, but you're playing by yourself; try to get all 10 in as few rolls as possible (less than 10 rolls is pretty good)</p> */}
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
          roll dice
        </button>

        <button className="restart-button" onClick={handleRestart}>
          restart
        </button>
      </main>
    </>
  );
}
export default App;