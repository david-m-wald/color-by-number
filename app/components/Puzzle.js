//Front matter for test case - to be moved later / passed as props to Puzzle from a Menu component
let colorList = [
  "rgba(255, 255, 255, 1)",
  "rgba(255, 0, 0, 1)",
  "rgba(0, 128, 0, 1)",
  "rgba(0, 0, 255, 1)",
  "rgba(255, 255, 0, 1)",
  "rgba(255, 165, 0, 1)",
  "rgba(100, 100, 100, 1)",
  "rgba(50, 50, 50, 1)",
  "rgba(50, 100, 100, 1)",
  "rgba(75, 30, 25, 1)",
  "rgba(25, 100, 50, 1)"
];

let layout2D = [
  [0, 1, 2, 3, 6, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 4, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 4, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 4, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 5, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 5, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 5, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 5, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 5, 7, 8, 9, 1, 10],
  [0, 1, 2, 3, 5, 7, 8, 9, 1, 10]
];

let layout1D = layout2D.reduce((row1, row2) => row1.concat(row2)); //Flattened 2D board
    
let nRows = layout2D.length;
let nCols = layout2D[0].length;
let nTiles = layout1D.length;
let maxNumber = Math.max(...layout1D);

//Count number of tiles required for each color
let tileCount = Array(maxNumber + 1);
tileCount.fill(0);
for (let iTile = 0; iTile < nTiles; iTile++)
  tileCount[layout1D[iTile]]++;

//Initialize object array of color-tile statistics for puzzle
let colorInfo = [];
for (let iColor = 0; iColor <= maxNumber; iColor++)
  colorInfo.push({
    color: colorList[iColor],   //color
    nTiles: tileCount[iColor],  //number of tiles requiring specified color
    correctTiles: 0,            //number of tiles correctly having specified color
    incorrectTiles: 0           //number of tiles incorrectly having specified color
  });
colorInfo[0].correctTiles = tileCount[0];
colorInfo[0].incorrectTiles = nTiles - tileCount[0];


class Puzzle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNumber: 0,
      selectedColor: "rgba(255, 255, 255, 1)",
      colorInfo: colorInfo,
      paintModeOn: false,
      qfArea: Array.from(new Array(nRows), () => new Array(nCols).fill(false))
    };
    this.changeSelectedInfo = this.changeSelectedInfo.bind(this);
    this.updateColorInfo = this.updateColorInfo.bind(this);
    this.startPaintMode = this.startPaintMode.bind(this);
    this.stopPaintMode = this.stopPaintMode.bind(this);
    this.isComplete = this.isComplete.bind(this);
    this.quickFill = this.quickFill.bind(this);
    this.findAdjacent = this.findAdjacent.bind(this);
  }

  //Method updates active selection info for top-level state
  changeSelectedInfo(number) {
    if (this.state.selectedNumber == number) return; //ignore if not selecting new number
    this.setState({
      selectedNumber: number,
      selectedColor: colorList[number],
      qfArea: Array.from(new Array(nRows), () => new Array(nCols).fill(false)) //reset quick fill area
    });
  }

  //Method updates tile-color statistics for top-level state
  updateColorInfo(number, deltaCorrect, deltaIncorrect) {
    this.setState((state, props) => {
      let newColorInfo = [...(state.colorInfo)]; //non-shallow copy of array with shallow copies of object elements
      let newInfo = Object.assign({}, state.colorInfo[number]) //deep copy of target element for modification
      newInfo.correctTiles = newInfo.correctTiles + deltaCorrect;
      newInfo.incorrectTiles = newInfo.incorrectTiles + deltaIncorrect;
      newColorInfo.splice(number, 1, newInfo); //replace original target element with modified copy in array copy
      return {colorInfo: newColorInfo};
    });
  }

  //Method turns paint mode on
  startPaintMode() {
    this.setState({paintModeOn: true});
  }

  //Method turns paint mode off
  stopPaintMode() {
    this.setState({paintModeOn: false});
  }

  //Method performs setup for a double-click quick fill
  quickFill(targetRow, targetCol) {
    let qfLayout = Array.from(new Array(nRows), () => new Array(nCols).fill(false));
    qfLayout[targetRow][targetCol] = true;
    this.findAdjacent(targetRow, targetCol, qfLayout);
    this.setState({
      qfArea: qfLayout
    });
  }

  /*Method recursively finds all consecutive, orthogonally adjacent tiles with the same number as
    a double-click quick fill target tile*/
  findAdjacent(row, col, qfLayout) {
    //Only unprocessed tiles with the proper number and no row/column out-of-bounds issues are processed

    //Check tile above
    if (row - 1 >= 0 && layout2D[row - 1][col] == layout2D[row][col] && !qfLayout[row - 1][col]) {
      qfLayout[row - 1][col] = true;
      this.findAdjacent(row - 1, col, qfLayout);
    }

    //Check tile below
    if (row + 1 < nRows && layout2D[row + 1][col] == layout2D[row][col] && !qfLayout[row + 1][col]) {
      qfLayout[row + 1][col] = true;
      this.findAdjacent(row + 1, col, qfLayout);
    }

    //Check tile to left
    if (col - 1 >= 0 && layout2D[row][col - 1] == layout2D[row][col] && !qfLayout[row][col - 1]) {
      qfLayout[row][col - 1] = true;
      this.findAdjacent(row, col - 1, qfLayout);
    }

    //Check tile to right
    if (col + 1 < nCols && layout2D[row][col + 1] == layout2D[row][col] && !qfLayout[row][col + 1]) {
      qfLayout[row][col + 1] = true;
      this.findAdjacent(row, col + 1, qfLayout);
    }
  }

  //Method checks if puzzle is complete
  isComplete() {
    for (let iColor = 0; iColor <= maxNumber; iColor++)
      if (this.state.colorInfo[iColor].nTiles != this.state.colorInfo[iColor].correctTiles) return false;
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    //Check puzzle completion only if tile-color statistics change
    if (this.state.colorInfo != prevState.colorInfo)
      if (this.isComplete()) alert("Puzzle is complete!");
  }

  render() {
    return (
      <div id="puzzle">
        <Board nRows={nRows} nCols={nCols} numberLayout={layout2D} selectedNumber={this.state.selectedNumber}
            selectedColor={this.state.selectedColor} paintModeOn={this.state.paintModeOn}
            qfArea={this.state.qfArea} updateColorInfo={this.updateColorInfo}
            startPaintMode={this.startPaintMode} stopPaintMode={this.stopPaintMode}
            quickFill={this.quickFill} />
        <br/>
        <ColorBank nColors={maxNumber} selectedNumber={this.state.selectedNumber}
            colorInfo={this.state.colorInfo} selectColor={this.changeSelectedInfo} />
      </div>
    );
  }
}