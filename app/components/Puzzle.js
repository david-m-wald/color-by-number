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
      paintMode: false
    };
    this.changeSelectedInfo = this.changeSelectedInfo.bind(this);
    this.updateColorInfo = this.updateColorInfo.bind(this);
    this.startPaintMode = this.startPaintMode.bind(this);
    this.stopPaintMode = this.stopPaintMode.bind(this);
    this.isComplete = this.isComplete.bind(this);
  }

  //Method updates active selection info for top-level state
  changeSelectedInfo(number) {
    if (this.state.selectedNumber == number) return; //ignore if not selecting new number
    this.setState({
      selectedNumber: number,
      selectedColor: colorList[number]
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
    this.setState({paintMode: true});
  }

  //Method turns paint mode off
  stopPaintMode() {
    this.setState({paintMode: false});
  }

  //Method checks if puzzle is complete
  isComplete() {
    for (let iColor = 0; iColor <= maxNumber; iColor++)
      if (this.state.colorInfo[iColor].nTiles != this.state.colorInfo[iColor].correctTiles) return false;
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    //Check puzzle completion only if color-tile statistics change
    if (this.state.colorInfo != prevState.colorInfo)
      if (this.isComplete()) alert("Puzzle is complete!");
  }

  render() {
    return (
      <div id="puzzle">
        <Board nRows={nRows} nCols={nCols} numberLayout={layout2D} selectedNumber={this.state.selectedNumber}
            selectedColor={this.state.selectedColor} updateColorInfo={this.updateColorInfo}
            startPaintMode={this.startPaintMode} stopPaintMode={this.stopPaintMode}
            paintMode={this.state.paintMode} />
        <br/>
        <ColorBank nColors={maxNumber} selectedNumber={this.state.selectedNumber}
            selectColor={this.changeSelectedInfo} colorInfo={this.state.colorInfo} />
      </div>
    );
  }
}