class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let jsx = [];  

    for (let row = 0; row < this.props.nRows; row++) {
      for (let col = 0; col < this.props.nCols; col++) {
        jsx.push(<TileContainer row={row} col={col} nRows={this.props.nRows} nCols={this.props.nCols}
            number={this.props.numberLayout[row][col]} selectedNumber={this.props.selectedNumber}
            selectedColor={this.props.selectedColor} paintModeOn={this.props.paintModeOn}
            inQFArea={this.props.qfArea[row][col]} updateColorInfo={this.props.updateColorInfo}
            startPaintMode={this.props.startPaintMode} quickFill={this.props.quickFill} />);
      }
      jsx.push(<br/>)
    }

    return (
      <div id="board-frame">
        <div id="board" onMouseUp={this.props.stopPaintMode} onMouseLeave={this.props.stopPaintMode}>
          {jsx}
        </div>
      </div>
    );
  }
}