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
    this.colorTile = this.colorTile.bind(this);
  }

  //Mouse event handlers for applying color to tiles
  handleMouseDown() {
    this.colorTile();
    this.props.startPaintMode();
  }

  handleMouseEnter() {
    if (this.props.paintMode) this.colorTile();
  }

  //Method assigns color to a tile
  colorTile() {
    let number = this.props.number;
    let selectedNumber = this.props.selectedNumber;
    let selectedColor = this.props.selectedColor;
    let appliedNumber = this.state.appliedNumber;
    let updateColorInfo = this.props.updateColorInfo;

    if (selectedNumber == number) {            //select correct tile?
      if (appliedNumber == number) return;     //existing tile color is correct? -> no state update, no re-render   
     
      //existing tile color is incorrect?
      updateColorInfo(appliedNumber, 0, -1);   //remove existing incorrect color from count
      updateColorInfo(selectedNumber, 1, 0);   //add correct color to count
      this.setState({
        appliedColor: selectedColor,
        appliedNumber: selectedNumber,
        displayNumber: "hidden"
      });
    } else {                                   //select incorrect tile?
      if (appliedNumber == number)             //existing tile color is correct?
        updateColorInfo(appliedNumber, -1, 0); //remove existing correct color from count
      else                                     //existing tile color is incorrect?
        updateColorInfo(appliedNumber, 0, -1); //remove existing incorrect color from count

      updateColorInfo(selectedNumber, 0, 1);   //add new incorrect color to count
      this.setState({
        appliedColor: selectedColor.replace("1)", "0.5)"), //semi-transparent color
        appliedNumber: selectedNumber,
        displayNumber: number == 0 ? "hidden" : "visible"
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //Only re-render if state changes
    return nextState != this.state;
  }

  render() {
    return <Tile nRows={this.props.nRows} nCols={this.props.nCols} number={this.props.number}
      color={this.state.appliedColor} display={this.state.displayNumber}
      onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} />;
  }
}