let ScrollArrow = (props) => {
  return (
    <div className={`scrollArrow scrollArrow-${props.direction}`} 
      style={{backgroundColor: props.active ? "darkgray" : "darkslategray"}}
      onClick={() => props.scroll(props.direction)}>
    </div>
  );
}