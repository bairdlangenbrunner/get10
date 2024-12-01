export default function Die(props) {

  return (
    <button
      key={props.id}
      className={props.hold ? "die die-hold" : "die"}
      onClick={props.handleClick}
    >
      {props.value}
    </button>
  );
}
