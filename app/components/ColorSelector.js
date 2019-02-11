class ColorSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    //component only re-rendered if shadow or inner color change
    return (nextProps.shadow != this.props.shadow || nextProps.innerColor != this.props.innerColor);
  }

  render() {
    return (
      <div className="colorSelector" onClick={() => this.props.onClick(this.props.number)}
          style={{backgroundColor: this.props.outerColor, boxShadow: this.props.shadow}}>
        <div className="colorSelectorInterior" style={{backgroundColor: this.props.innerColor}}>
          <p style={{visibility: this.props.display}}>{this.props.number}</p>
        </div>
      </div>
    );
  }
}