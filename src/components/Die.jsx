export default function Die(props) {

  return (
    <button
      disabled={props.gameWon}
      key={props.id}
      className={props.hold ? "die die-hold" : "die"}
      onClick={props.handleClick}
    >
      {props.value}
    </button>
  );
}
