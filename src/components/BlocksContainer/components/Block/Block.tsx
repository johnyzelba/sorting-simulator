import React, { Component } from 'react';
import './Block.scss';

type Props = {
  numOfBlocks: number,
  index: number,
  bgColor: string,
  swapSpeed: number
}

type State = {
  bgColor: string,
  shouldEffectFire: boolean,
  newBgColor: string,
}

export class Block extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      bgColor: this.props.bgColor,
      shouldEffectFire: false,
      newBgColor: this.props.bgColor,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.newBgColor !== nextProps.bgColor) {
      this.setState({ newBgColor: nextProps.bgColor, shouldEffectFire: true })
      return true;
    } else if (this.state.shouldEffectFire === true) {
      setTimeout(() => {
        this.setState({ bgColor: this.state.newBgColor, shouldEffectFire: false })
      }, this.props.swapSpeed * 1000 );
      return true;
    } 
    return false;
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="box-container"
        style={
          {
            width: `${100 / this.props.numOfBlocks}%`,
          }
        }
      >
        <div
          className="block-container"
          style={
            {
              backgroundColor: this.state.bgColor,
              width: `100%`,
              transform: `rotateX(${this.state.shouldEffectFire ? '90' : '0'}deg) translateZ(50px)`,
              left: `0px`,
              transitionDuration: this.state.shouldEffectFire ? `${this.props.swapSpeed}s` : '0s'
            }
          }
        >
        </div>
        <div
          className="bottom-block-container"
          style={
            {
              backgroundColor: this.state.newBgColor,
              width: `100%`,
              transform: `rotateX(${this.state.shouldEffectFire ? '0' : '90'}deg) translateZ(-50px)`,
              left: `0px`,
              transitionDuration: this.state.shouldEffectFire ? `${this.props.swapSpeed}s` : '0s'
            }
          }
        >
        </div>
      </div>
    )
  }
}