class ColorBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftActive: false,
      rightActive: false
    }
    this.scroll = this.scroll.bind(this);
    this.updateScrollArrows = this.updateScrollArrows.bind(this);
  }

  componentDidMount() {
    let colorSet = document.getElementById("color-set");
    
    /*ensure that color-set scroll begins fully to left and that right scroll arrow is active
      to start, if needed*/
    colorSet.scrollLeft = 0;
    if (colorSet.scrollWidth > colorSet.offsetWidth)
      this.setState({rightActive: true});

    /*ensure scroll arrow condition is correct upon window resizing*/
    window.addEventListener("resize", this.updateScrollArrows);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateScrollArrows);
  }

  //Method scrolls color-set when clicking on a scroll arrow
  scroll(direction) {
    let colorSet = document.getElementById("color-set");
    if (direction == "left") colorSet.scrollLeft -= colorSet.clientWidth;
    if (direction == "right") colorSet.scrollLeft += colorSet.clientWidth;
    this.updateScrollArrows();
  }
  
  //Method updates active/inactive display condition of scroll arrows when scrolling or resizing window
  updateScrollArrows() {
    let colorSet = document.getElementById("color-set");
 
    /*left arrow - switch from active if scroll position fully to left
                  - switch from inactive if scroll position not fully to left
                  - no state update/re-render if no change in active/inactive condition*/
    if (this.state.leftActive && colorSet.scrollLeft == 0)
      this.setState({leftActive: false});
    else if (!this.state.leftActive && colorSet.scrollLeft != 0)
      this.setState({leftActive: true});
    
    /*right arrow - switch from active if scroll position fully to right
                  - switch from inactive if scroll position not fully to right
                  - no state update/re-render if no change in active/inactive condition*/
    let fractionScrolled = colorSet.scrollLeft / (colorSet.scrollWidth - colorSet.clientWidth);
    let tolerance = 0.995; //helps mitigate pixel-rounding when evaluating end scroll position
    if (this.state.rightActive && fractionScrolled >= tolerance)
      this.setState({rightActive: false});
    else if (!this.state.rightActive && fractionScrolled <= tolerance)
      this.setState({rightActive: true});
  }
 
  render() {
    let jsx = [];
    let selectShadow = "0px 0px 6px 2px red";
    let outerColor, innerColor, display;
    let nTiles, correctTiles, incorrectTiles; 

    for (let i = 0; i <= this.props.nColors; i++) {
      outerColor = this.props.colorInfo[i].color;
      nTiles = this.props.colorInfo[i].nTiles;
      correctTiles = this.props.colorInfo[i].correctTiles;
      incorrectTiles = this.props.colorInfo[i].incorrectTiles;
  
      if (correctTiles == nTiles && incorrectTiles == 0) { //correct # of tiles colored and no extras
        innerColor = outerColor;
        display = "hidden";
      } else if (correctTiles == nTiles) {                 //correct # of tiles colored with extras
        innerColor = "rgba(255, 255, 255, .5)";
        display = "visible";
      } else {                                             //incorrect # of tiles colored
        innerColor = "rgba(255, 255, 255, 1)";
        display = "visible";
      }
      if (i == 0) display = "hidden";

      jsx.push(<ColorSelector number={i} outerColor={outerColor} innerColor={innerColor} display={display}
          shadow={i == this.props.selectedNumber ? selectShadow : ""}
          onClick={this.props.selectColor} />);
    }

    return (
      <div id="color-bank">
        <ScrollArrow direction={"left"} active={this.state.leftActive} scroll={this.scroll} />
        <div id="color-set">
          {jsx}
        </div>
        <ScrollArrow direction={"right"} active={this.state.rightActive} scroll={this.scroll} />
      </div>
    );
  }
}