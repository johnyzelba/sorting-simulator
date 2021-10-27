import React, { Component } from 'react'; 
import './BlocksContainer.scss';

type SampleProps = {
  time?: Date
}

export class Block extends Component<SampleProps> {
  constructor(props: SampleProps) {
    super(props)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="block-container">
        
      </div>
    )
  }
}