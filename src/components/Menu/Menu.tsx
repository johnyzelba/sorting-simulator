import React, { Component } from 'react';
import { DragableBar } from './components/DragableBar/DragableBar';
import './Menu.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faCaretSquareDown } from '@fortawesome/free-solid-svg-icons';

type Props = {
  onItemsLengthChange: any,
  onScanSpeedChange: any,
  onSwapSpeedChange: any,
  onSelectSortingAlgo: any,
  onStartSimulation: any,
  onGenerateNewItems: any,
  itemsLength: number,
  scanSpeed: number,
  swapSpeed: number,
  startSimulator: boolean,
}

type State = {
  disableRefreshBtn: boolean
}

export class Menu extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      disableRefreshBtn: false
    }
  }

  shouldComponentUpdate(newProps: Props, newState: State) {
    console.log('-------', newProps.startSimulator)
    return true;
  }

  render() {
    return (
      <div className="menu" data-testid="Menu">
        <h2></h2>
        <div className="box-container">
          <div className="box">
            <select
              onChange={(e) => this.props.onSelectSortingAlgo(e.target.value)}
              disabled={this.props.startSimulator === true}
            >
              <option selected value="buble">Buble sort</option>
              <option value="selection">Selection sort</option>
              <option value="insertion">Insertion sort</option>
              <option value="merge">Merge sort</option>
              <option value="quick">Quick sort</option>
            </select>
          </div>
        </div>
        <DragableBar disabled={this.props.startSimulator === true} title={"Items"} min={3} max={200} value={this.props.itemsLength - 3} onValueChange={this.props.onItemsLengthChange} />
        <DragableBar title={"Scan Speed"} min={10} max={1000} value={this.props.scanSpeed - 10} onValueChange={this.props.onScanSpeedChange} />
        <DragableBar title={"Swap Speed"} min={200} max={1000} value={this.props.swapSpeed - 200} onValueChange={this.props.onSwapSpeedChange} />
        <div className="buttons-container">
          <button className={this.props.startSimulator === true ? "stop-button" : "start-button"} onClick={this.props.onStartSimulation}>
            <div style={{ opacity: this.props.startSimulator === true ? 1 : 0 }}>Stop Simulation</div>
            <div style={{ opacity: this.props.startSimulator === true ? 0 : 1 }}>Start Simulation</div>
          </button>
          <button
            className="refresh-button"
            onClick={() => {
              this.setState({ disableRefreshBtn: true });
              setTimeout(() => {
                this.setState({ disableRefreshBtn: false });
              }, 800);
              this.props.onGenerateNewItems();
            }}
            disabled={this.state.disableRefreshBtn || this.props.startSimulator === true}
          >
            <FontAwesomeIcon icon={faRedo} />
          </button>
        </div>
      </div>
    )
  }
}


