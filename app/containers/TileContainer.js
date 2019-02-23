class TileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appliedColor: "rgba(255, 255, 255, 1)",
      appliedNumber: 0,
      displayNumber: this.props.number == 0 ? "hidden" : "visible"
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  //Event handler to apply color to tile on basic mouse press
  handleMouseDown() {
    this.setState(TileContainer.colorTile(this.props, this.state));
    this.props.startPaintMode();
  }

  //Event handler to apply color to tile when painting
  handleMouseEnter() {
    if (this.props.paintModeOn)
      this.setState(TileContainer.colorTile(this.props, this.state));
  }

  //Event handler to set up quick fill coloring when double-clicking
  handleDoubleClick() {
    if (this.state.appliedNumber == this.props.number)
      this.props.quickFill(this.props.row, this.props.col);
  }

  /*Class method manages tasks when coloring a tile, returning object for state updates
    - note: defined as class method with explicitly passed state/props becuase method is called
      within instance methods and within getDerivedStateFromProps method*/      
  static colorTile(props, state) {
    let number = props.number;
    let selectedNumber = props.selectedNumber;
    let selectedColor = props.selectedColor;
    let appliedNumber = state.appliedNumber;
    let updateColorInfo = props.updateColorInfo;

    if (selectedNumber == number) {             //select correct tile?
      if (appliedNumber == number) return null; //existing tile color correct? -> no state update   
     
      //existing tile color incorrect?
      updateColorInfo(appliedNumber, 0, -1);   //remove existing incorrect color from count
      updateColorInfo(selectedNumber, 1, 0);   //add correct color to count
      return {
        appliedColor: selectedColor,
        appliedNumber: selectedNumber,
        displayNumber: "hidden"
      };
    } else {                                   //select incorrect tile?
      if (appliedNumber == number)             //existing tile color is correct?
        updateColorInfo(appliedNumber, -1, 0); //remove existing correct color from count
      else                                     //existing tile color is incorrect?
        updateColorInfo(appliedNumber, 0, -1); //remove existing incorrect color from count

      updateColorInfo(selectedNumber, 0, 1);   //add new incorrect color to count
      return {
        appliedColor: selectedColor.replace("1)", "0.5)"), //semi-transparent color
        appliedNumber: selectedNumber,
        displayNumber: number == 0 ? "hidden" : "visible"
      };
    }
  }

  static getDerivedStateFromProps(props, state) {
    //Execute quick fill if tile is in active quick fill area
    if (props.inQFArea) return TileContainer.colorTile(props, state);

    //Execute hint mode coloring for numbered tiles with no exising color applied
    if (props.number != 0 && state.appliedNumber == 0) {
      if (props.selectedNumber == props.number) //Apply coloring for current selection
        return {appliedColor: "rgba(0, 0, 0, 0.1)"};
      else                                      //Remove coloring for previous selection
        return {appliedColor: "rgba(255, 255, 255, 1)"};
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    //Only re-render if state changes
    for (let property in this.state)
      if (this.state[property] != nextState[property]) return true;
    return false;
  }

  render() {
    //alert("rendered");
    return <Tile nRows={this.props.nRows} nCols={this.props.nCols} number={this.props.number}
      color={this.state.appliedColor} display={this.state.displayNumber}
      onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter}
      onDoubleClick={this.handleDoubleClick} />;
  }
}