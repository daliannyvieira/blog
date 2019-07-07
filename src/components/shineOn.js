import React from 'react';
import mojs from 'mo-js';

class ShineOn extends React.Component {
  state = {
    numBurstsToGenerate: 5,
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

    while (this.state.bursts.length < this.state.numBurstsToGenerate) {
      this.state.bursts.push(
        new mojs.Burst({
          left: 0,
          top: 0,
          radius: { 4: 19 },
          angle: this.rand({ min: 0, max: 359 }),
          children: {
            shape: `line`,
            radius: this.rand({ min: 2, max: 12 }),
            scale: this.rand({ min: 0.5, max: 4, int: false }),
            stroke: `rgb(
                ${this.rand({ min: 175, max: 255 })},
                ${this.rand({ min: 175, max: 255 })},
                ${this.rand({ min: 175, max: 255 })}
              )`,
            strokeDasharray: `100%`,
            strokeDashoffset: { '-100%': `100%` },
            duration: this.rand({ min: 400, max: 600 }),
            easing: `quad.out`,
          },
          onStart() {
            this.el.style.zIndex = `9999`;
          },
          onComplete() {
            this.el.style.zIndex = `0`;
          },
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
