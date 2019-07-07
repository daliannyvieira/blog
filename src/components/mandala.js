import React from 'react';
import mojs from 'mo-js';

class ShineOn extends React.Component {
  state = {
    numBurstsToGenerate: 10,
    bursts: [],
  };

  rand = ({ min = 0, max = 1, int = true }) => {
    if (int) {
      return Math.floor(Math.random() * (max - min) + min);
    } else {
      return Math.random() * (max - min) + min;
    }
  };

  generateBursts = (numBursts = this.state.numBurstsToGenerate) => {
    this.setState({
      bursts: [],
    });

    while (this.state.bursts.length < numBursts) {
      this.state.bursts.push(
        new mojs.Burst({
          left: 0,
          top: 0,
          radius: { 4: 19 },
          children: {
            top: 0,
            left: 0,
            shape: 'rect',
            fill: 'none',
            radius: this.rand({ min: 2, max: 100 }),
            stroke: `rgb(
              ${this.rand({ min: 175, max: 255 })},
              ${this.rand({ min: 175, max: 255 })},
              ${this.rand({ min: 175, max: 255 })}
            )`,
            strokeWidth: this.rand({ min: 1, max: 2 }),
            strokeDasharray: '100%',
            strokeDashoffset: { '-100%': '100%' },
            angle: this.rand({ min: 50, max: 1000 }),
            duration: this.rand({ min: 1000, max: 4000 }),
            repeat: this.rand({ min: 1, max: 10 }),
          },
          onStart() {
            this.el.style.zIndex = `9999`;
          },
          // onComplete() {
          //   this.el.style.zIndex = `0`;
          // },
        })
      );
    }
  };

  componentDidMount() {
    if (this.state.bursts.length !== this.state.numBurstsToGenerate) {
      this.generateBursts();
    }
  }

  kaboom = (e, child) => {
    e.stopPropagation();

    if (this.state.bursts.length !== this.state.numBurstsToGenerate) {
      this.generateBursts();
    }

    this.state.bursts[this.rand({ max: this.state.bursts.length })]
      .tune({ x: e.pageX, y: e.pageY })
      .replay();

    if (child.props.onClick) {
      child.props.onClick();
    }
  };

  render() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        onClick: e => this.kaboom(e, child),
        style: {
          cursor: `pointer`,
          userSelect: `none`,
        },
      });
    });
  }
}

export default ShineOn;
