import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import { BlocksContainer } from './components/BlocksContainer/BlocksContainer';
import { Menu } from './components/Menu/Menu';

type Props = {
}

type State = {
  itemsLength: number,
  scanSpeed: number,
  swapSpeed: number,
  startSimulator: boolean,
  generateNewItems: boolean,
  selectSortingAlgo: 'buble' | 'selection' | 'insertion' | 'merge' | 'quick'
}

export class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      itemsLength: 50, // min={3} max={200}
      scanSpeed: 200, // min={10} max={1000}
      swapSpeed: 500, // min={200} max={1000}
      startSimulator: false,
      selectSortingAlgo: 'buble',
      generateNewItems: false,
    }
  }
  render() {
    return (
      <div className="App">
        <Menu
          onItemsLengthChange={(e: any) => this.setState({ itemsLength: e })}
          onScanSpeedChange={(e: any) => this.setState({ scanSpeed: e })}
          onSwapSpeedChange={(e: any) => this.setState({ swapSpeed: e })}
          onSelectSortingAlgo={(e: any) => this.setState({ selectSortingAlgo: e })}
          onStartSimulation={() => { this.setState({ startSimulator: !this.state.startSimulator }) }}
          onGenerateNewItems={() => { this.setState({ generateNewItems: !this.state.generateNewItems }) }}
          itemsLength={this.state.itemsLength}
          scanSpeed={this.state.scanSpeed}
          swapSpeed={this.state.swapSpeed}
          startSimulator={this.state.startSimulator}
        />
        <BlocksContainer
          itemsLength={this.state.itemsLength}
          scanSpeed={this.state.scanSpeed}
          swapSpeed={this.state.swapSpeed}
          startSimulator={this.state.startSimulator}
          selectSortingAlgo={this.state.selectSortingAlgo}
          generateNewItems={this.state.generateNewItems}
          onSimulationEnded={() => { this.setState({ startSimulator: false }) }}
        />
      </div>
    )
  }
}