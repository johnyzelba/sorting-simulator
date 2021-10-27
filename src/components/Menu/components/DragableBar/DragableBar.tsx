import React, { Component } from 'react';
import './DragableBar.scss';

type Props = {
  title: string,
  min: number,
  max: number,
  value: number,
  onValueChange: any
  disabled?: boolean
}

type State = {
  dragablePosition: number,
  isDragging: boolean
}

export class DragableBar extends Component<Props, State> {

  barRef: React.RefObject<any>;

  constructor(props: Props) {
    super(props)
    this.barRef = React.createRef();
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.state = {
      // dragablePosition: Math.floor(this.props.value * 150 / (this.props.max - this.props.min)) - this.props.min,
      dragablePosition: ((this.props.value * 100 / (this.props.max - this.props.min)) * 150 / 100),
      isDragging: false
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);
  }

  handleDragStart(e: any) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ isDragging: true })
  }

  handleDrag(e: any) {
    if (this.state.isDragging) {
      let newPosition = e.clientX - this.barRef.current.offsetLeft;
      console.log('position', newPosition)
      if (newPosition >= 0 && newPosition <= 150) {
        this.setState({ dragablePosition: newPosition })
      }
    }
  }

  handleDragEnd(e: any) {
    this.setState({ isDragging: false });
    this.props.onValueChange(this.props.min + Math.round((((this.state.dragablePosition * 100) / 150) * (this.props.max - this.props.min)) / 100))
  }


  render() {
    return (
      <div className={`dragable-bar-container`} data-testid="DragableBar" ref={this.barRef}>
        <div className="text-container">
          <span>{this.props.title}: {this.props.min + Math.round((((this.state.dragablePosition * 100) / 150) * (this.props.max - this.props.min)) / 100)}</span>
        </div>
        {this.props.disabled ? <></> :
          <div
            className="dragable"
            data-testid="DragableBar"
            onMouseDown={this.handleDragStart}
            style={{ left: `${this.state.dragablePosition}px` }}
          >
          </div>
        }
        <div className="bar" data-testid="DragableBar">
        </div>
      </div>
    )
  }
}
