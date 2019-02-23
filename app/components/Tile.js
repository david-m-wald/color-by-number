let Tile = (props) => {
  let size = 100 / Math.max(props.nRows, props.nCols);

  return (
    <div className="tile" onMouseDown={props.onMouseDown} onMouseEnter={props.onMouseEnter}
      onDoubleClick={props.onDoubleClick}
      style={{backgroundColor: props.color, width: `${size}%`, paddingBottom: `${size}%`}}>
      <p style={{visibility: props.display}}>{props.number}</p>
    </div>
  );
}