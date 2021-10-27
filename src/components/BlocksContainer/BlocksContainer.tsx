import React, { Component, Ref } from 'react';
import './BlocksContainer.scss';
import { Block } from './components/Block/Block';

type Props = {
  itemsLength: number
  scanSpeed: number
  swapSpeed: number
  startSimulator: boolean
  generateNewItems: boolean
  selectSortingAlgo: 'buble' | 'selection' | 'insertion' | 'merge' | 'quick'
  onSimulationEnded: any
}

type State = {
  blocks: { value: number, color: string }[],
  markedIndex: number,
  markedSecondIndex: number,
  mergeMarkedIndexs: number[],
  i: number,
  j: number,
  sort: 'buble' | 'selection' | 'insertion' | 'merge' | 'quick',
  startSimulator: boolean,
  simulationLunched: boolean,
  numOfBlocks: number,
  scanSpeed: number,
  swapSpeed: number,
}

const color = { r: 40, g: 190, b: 220 };


export class BlocksContainer extends Component<Props, State> {



  blocksContainer: React.RefObject<any>;

  constructor(props: Props) {
    super(props)
    this.state = {
      blocks: Array.from({ length: this.props.itemsLength }, (obj, index) => {
        return {
          value: index,
          color: `rgb(${color.r + ((250 - color.r) / this.props.itemsLength * index)},`
            + ` ${color.g + ((250 - color.g) / this.props.itemsLength * index)},`
            + ` ${color.b + ((250 - color.b) / this.props.itemsLength * index)})`
        }
      }).sort(() => Math.random() - 0.5),
      markedIndex: -1,
      markedSecondIndex: -1,
      mergeMarkedIndexs: Array(this.props.itemsLength).fill(-1),
      i: 0,
      j: 0,
      sort: this.props.selectSortingAlgo,
      startSimulator: this.props.startSimulator,
      simulationLunched: false,
      numOfBlocks: this.props.itemsLength,
      scanSpeed: this.props.scanSpeed,
      swapSpeed: this.props.swapSpeed
    }
    this.blocksContainer = React.createRef();
  }

  shouldComponentUpdate(newProps: Props, newState: State) {
    let returnStatus = true;
    if (newProps.startSimulator !== this.state.startSimulator) {
      this.setState({
        startSimulator: newProps.startSimulator,
      })
      if (newState.startSimulator !== this.state.startSimulator) {
        returnStatus = true;
      }
      if (newState.startSimulator === false && this.state.simulationLunched === true) {
        this.setState({
          simulationLunched: false,
        })
        returnStatus = true;
      }
    } else if ((newProps.itemsLength !== this.state.numOfBlocks) && !this.state.startSimulator) {
      this.setState({
        numOfBlocks: newProps.itemsLength,
        blocks: Array.from({ length: newProps.itemsLength }, (obj, index) => {
          return {
            value: index,
            color: `rgb(${color.r + ((250 - color.r) / newProps.itemsLength * index)},`
              + ` ${color.g + ((250 - color.g) / newProps.itemsLength * index)},`
              + ` ${color.b + ((250 - color.b) / newProps.itemsLength * index)})`
          }
        }).sort(() => Math.random() - 0.5),
        markedIndex: -1,
        markedSecondIndex: -1,
        mergeMarkedIndexs: Array(newProps.itemsLength).fill(-1),
        i: 0,
        j: 0
      })
      returnStatus = true;
    } else if ((newProps.scanSpeed !== this.state.scanSpeed || newProps.swapSpeed !== this.state.swapSpeed || newProps.selectSortingAlgo !== this.state.sort)) {
      this.setState({
        scanSpeed: newProps.scanSpeed,
        swapSpeed: newProps.swapSpeed,
        sort: newProps.selectSortingAlgo,
      })
      returnStatus = false;
    } else if ((this.state.i !== newState.i) || (this.state.j !== newState.j)) {
      returnStatus = true;
    } else if ((this.state.markedIndex !== newState.markedIndex) || (this.state.markedSecondIndex !== newState.markedSecondIndex) || (this.state.mergeMarkedIndexs !== newState.mergeMarkedIndexs)) {
      returnStatus = true;
    } else if ((this.state.simulationLunched !== newState.simulationLunched)) {
      returnStatus = true;
    } else if (this.props.generateNewItems !== newProps.generateNewItems) {
      this.setState({
        numOfBlocks: newProps.itemsLength,
        blocks: Array.from({ length: newProps.itemsLength }, (obj, index) => {
          return {
            value: index,
            color: `rgb(${color.r + ((250 - color.r) / newProps.itemsLength * index)},`
              + ` ${color.g + ((250 - color.g) / newProps.itemsLength * index)},`
              + ` ${color.b + ((250 - color.b) / newProps.itemsLength * index)})`
          }
        }).sort(() => Math.random() - 0.5)
      })
      returnStatus = true;
    }
    return returnStatus;
  }

  componentWillMount() {
  }

  async componentDidUpdate() {
    if (this.state.startSimulator && !this.state.simulationLunched) {
      this.setState({ simulationLunched: true })
      await this.animate();
    }

  }

  async componentDidMount() {
    if (this.state.startSimulator && !this.state.simulationLunched) {
      this.setState({ simulationLunched: true })
      await this.animate();
    }

  }

  async animate() {
    switch (this.state.sort) {
      case 'selection':
        await this.selectionSort();
        break;
      case 'buble':
        await this.bublenSort();
        break;
      case 'insertion':
        await this.insertionSort();
        break;
      case 'merge':
        await this.mergeSort([...this.state.blocks], 0);
        break;
      case 'quick':
        await this.quickSort([...this.state.blocks], 0, this.state.numOfBlocks - 1);
        break;
      default:
        break;
    }
    this.props.onSimulationEnded();
    this.setState({
      markedIndex: -1,
      markedSecondIndex: -1,
      mergeMarkedIndexs: Array(this.state.numOfBlocks - 1).fill(-1),
      simulationLunched: false,
    })
  }

  async selectionSort() {
    this.setState({ i: 0 });
    for await (const block of this.state.blocks) {
      let max = 0;
      let maxIndex = 0;
      this.setState({ j: 0 });
      for await (const innerLoopBlock of this.state.blocks) {
        if (this.state.j >= this.state.i) {
          this.setState({ markedIndex: this.state.j });
          if (this.state.scanSpeed > 0) {
            await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
          }
          if (innerLoopBlock) {
            if (max < innerLoopBlock.value) {
              max = innerLoopBlock.value;
              maxIndex = this.state.j;
            }
          }
        }
        this.setState({ j: this.state.j + 1 });
      }
      this.setState({ markedIndex: -1 });
      if (max > 0) {
        let tempObj = this.state.blocks[maxIndex];
        this.state.blocks[maxIndex] = this.state.blocks[this.state.i];
        this.state.blocks[this.state.i] = tempObj;
        this.setState({ i: this.state.i + 1 });
      }
    }
  }

  async bublenSort() {
    this.setState({ i: 0 });
    for await (const block of this.state.blocks) {
      this.setState({ j: 0 });
      for await (const innerLoopBlock of this.state.blocks) {
        if (this.state.simulationLunched === false) {
          break;
        }
        if (this.state.j < (this.state.numOfBlocks - 1 - this.state.i)) {
          await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
          this.setState({ markedIndex: this.state.j });
          if (innerLoopBlock && this.state.j >= 0 && this.state.j < this.state.numOfBlocks - 1) {
            if (this.state.blocks[this.state.j + 1].value > this.state.blocks[this.state.j].value) {
              let tempObj = this.state.blocks[this.state.j];
              this.state.blocks[this.state.j] = this.state.blocks[this.state.j + 1];
              this.state.blocks[this.state.j + 1] = tempObj;
            }
          }

        }
        this.setState({ j: this.state.j + 1 });
      }
      this.setState({ i: this.state.i + 1 });
    }
  }

  async insertionSort() {
    this.setState({ i: 0 });
    for await (const block of this.state.blocks) {
      this.setState({ j: this.state.i });
      this.setState({ markedIndex: this.state.i });
      await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
      if (this.state.j >= 1 && this.state.j <= this.state.numOfBlocks - 1) {
        let tempValue = { ...this.state.blocks[this.state.i] };
        if (this.state.simulationLunched === false) {
          break;
        }
        for await (const innerLoopBlock of this.state.blocks) {
          await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));

          if (innerLoopBlock && this.state.j >= 0) {
            this.setState({ markedSecondIndex: this.state.j - 1 });
            if (this.state.j === 0) {
              this.state.blocks[this.state.j] = { ...tempValue };
              break;
            } else if (this.state.blocks[this.state.j - 1].value > tempValue.value) {
              this.state.blocks[this.state.j] = { ...this.state.blocks[this.state.j - 1] };
            } else if (this.state.blocks[this.state.j - 1].value <= tempValue.value) {
              this.state.blocks[this.state.j] = { ...tempValue };
              break;
            }
          }
          this.setState({ j: this.state.j - 1 });
        }
        this.setState({ markedSecondIndex: -1 });
      }
      this.setState({ i: this.state.i + 1 });
    }
  }

  async mergeSort(array: any[], indexBgin: number) {
    if (array.length < 2)
      return;
    let mid = Math.round(array.length / 2);
    let left = array.slice(0, mid);
    let right = array.slice(mid);
    await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
    await Promise.all([this.mergeSort(left, indexBgin), this.mergeSort(right, indexBgin + mid)]);
    await this.merge(left, right, array, indexBgin, indexBgin + mid);
  }

  async merge(left: any[], right: any[], array: any[], indexBginL: number, indexBginR: number) {
    let i = 0, j = 0, k = 0, indexL = indexBginL, indexA = indexBginL, indexR = indexBginR;
    while (i < left.length && j < right.length) {
      if (this.state.simulationLunched === false) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
      this.state.mergeMarkedIndexs[indexA - k] = indexA;
      if (left[i].value <= right[j].value) {
        array[k] = left[i];
        this.state.blocks[indexA] = { ...left[i] };
        i += 1;
        indexL += 1;
      } else {
        array[k] = right[j];
        this.state.blocks[indexA] = { ...right[j] };
        j += 1;
        indexR += 1;
      }
      k += 1;
      indexA += 1;
      this.setState({ blocks: this.state.blocks })
    }

    while (i < left.length) {
      if (this.state.simulationLunched === false) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
      this.state.mergeMarkedIndexs[indexA - k] = indexA;
      array[k] = left[i];
      this.state.blocks[indexA] = { ...left[i] };
      i += 1;
      k += 1;
      indexL += 1;
      indexA += 1;
      this.setState({ blocks: this.state.blocks })
    }

    while (j < right.length) {
      if (this.state.simulationLunched === false) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
      this.state.mergeMarkedIndexs[indexA - k] = indexA;
      array[k] = right[j];
      this.state.blocks[indexA] = { ...right[j] };
      j += 1;
      k += 1;
      indexR += 1;
      indexA += 1;
      this.setState({ blocks: this.state.blocks })
    }
    this.state.mergeMarkedIndexs[indexA - k] = -1;
  }

  async quickSort(array: any[], start: number, end: number) {
    if (start < end) {
      let pIndex = await this.partition(array, start, end);
      if (pIndex !== -1)
        await Promise.all([this.quickSort(array, start, pIndex - 1), this.quickSort(array, pIndex + 1, end)]);
    }
  }

  async partition(array: any[], start: number, end: number): Promise<number> {
    let pivot = array[end];
    let pIndex = start;
    let index = start;
    let emptyArr = new Array(end - start);

    for await (const el of emptyArr) {
      if (this.state.simulationLunched === false) {
        break;
      }
      this.state.mergeMarkedIndexs[start] = pIndex;
      await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
      if (array[index].value <= pivot.value) {
        let tempObj = { ...array[index] };
        array[index] = { ...array[pIndex] };
        array[pIndex] = { ...tempObj };
        this.state.blocks[index] = { ...array[pIndex] };
        this.state.blocks[pIndex] = { ...tempObj };
        this.setState({ blocks: this.state.blocks })
        pIndex += 1;
      }
      index += 1;
    }
    if (this.state.simulationLunched === false) {
      return -1;
    }
    this.state.mergeMarkedIndexs[end] = pIndex;
    await new Promise(resolve => setTimeout(resolve, this.state.scanSpeed));
    let tempObj = { ...array[end] };
    array[end] = { ...array[pIndex] };
    array[pIndex] = { ...tempObj };
    this.state.blocks[end] = { ...array[pIndex] };
    this.state.blocks[pIndex] = { ...tempObj };
    this.setState({ blocks: this.state.blocks })
    this.state.mergeMarkedIndexs[start] = -1;
    this.state.mergeMarkedIndexs[end] = -1;
    return pIndex;
  }

  render() {
    return (
      <div className="page-container">
        <div className="blocks-container" ref={this.blocksContainer}>
          {
            this.state.blocks.map((block, index) =>
              <Block numOfBlocks={this.state.numOfBlocks} index={index} bgColor={block.color} swapSpeed={this.state.swapSpeed / 1000} />
            )
          }
          {
            this.state.markedIndex >= 0 ?
              <div className="scanner-container"
                style={
                  {
                    width: `${100 / this.state.numOfBlocks}%`,
                    zIndex: 1,
                    left: 0,
                    transform: `translateX(${(this.blocksContainer.current.offsetWidth / this.state.numOfBlocks) * (this.state.markedIndex)}px)`,
                    backgroundColor: '#f1f2f3',
                    transition: `${(this.state.scanSpeed) / 1000}s ease-in-out`
                  }
                }
              />
              : <></>
          }
          {
            this.state.sort === "buble" && this.state.markedIndex >= 0 ?
              <div className="scanner-container"
                style={
                  {
                    width: `${100 / this.state.numOfBlocks}%`,
                    zIndex: 1,
                    left: 0,
                    transform: `translateX(${(this.blocksContainer.current.offsetWidth / this.state.numOfBlocks) * (this.state.markedIndex + 1)}px)`,
                    backgroundColor: '#f1f2f3',
                    transition: `${(this.state.scanSpeed) / 1000}s ease-in-out`
                  }
                }
              />
              : <></>
          }
          {
            this.state.sort === "insertion" && this.state.markedSecondIndex >= 0 ?
              <div className="scanner-container"
                style={
                  {
                    width: `${100 / this.state.numOfBlocks}%`,
                    zIndex: 1,
                    left: 0,
                    transform: `translateX(${(this.blocksContainer.current.offsetWidth / this.state.numOfBlocks) * (this.state.markedSecondIndex)}px)`,
                    backgroundColor: '#f1f2f3',
                    transition: `${(this.state.scanSpeed) / 1000}s ease-in-out`
                  }
                }
              />
              : <></>
          }

          {
            this.state.sort === "merge" || this.state.sort === "quick" ?
              this.state.mergeMarkedIndexs.map((mark, index) =>
                <>
                  {
                    mark >= 0 ?
                      <div
                        className="scanner-container"
                        key={`scanner-${index}`}
                        style={
                          {
                            width: `${100 / this.state.numOfBlocks}%`,
                            zIndex: 1,
                            left: 0,
                            transform: `translateX(${(this.blocksContainer.current.offsetWidth / this.state.numOfBlocks) * (mark)}px)`,
                            backgroundColor: '#f1f2f3',
                            transition: `${(this.state.scanSpeed) / 1000}s ease-in-out`
                          }
                        }
                      />
                      :
                      <></>
                  }
                </>
              )

              : <></>
          }
        </div>
      </div>
    )
  }
}