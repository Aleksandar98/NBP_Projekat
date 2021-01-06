import React, { Component } from 'react';

class Drum extends Component {
  constructor(props) {
    super(props);
    this.state = { kombinacija: [] };
  }

  componentDidMount() {
    fetch('http://localhost:5000/vratiKombinaciju')
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({ kombinacija: result });
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
          /*this.setState({
          isLoaded: true,
          error
        });
        */
        }
      );
  }

  napraviSlot(brojSlotova, niz) {
    let a = [];
    for (let i = 0; i < brojSlotova; i++) {
      a.push(
        React.createElement('ul', { className: 'slot' }, this.brojke(niz[i]))
      );
    }

    return a;
  }

  brojke(broj) {
    const a = [];
    a.push(React.createElement('li', { className: 'number' }, broj));
    if (broj === 1) {
      a.push(React.createElement('li', { className: 'number' }, 39));
    } else {
      a.push(React.createElement('li', { className: 'number' }, broj - 1));
    }

    for (let i = 1; i <= 7; i++) {
      a.push(
        React.createElement(
          'li',
          { className: 'number' },
          Math.floor(Math.random() * 39)
        )
      );
    }

    a.push(React.createElement('li', { className: 'number' }, broj + 1));
    return a;
  }

  pocniOdbrojavanje(onZavrsio) {
    setTimeout(function () {
      onZavrsio();
    }, 7000);
  }

  render() {
    return (
      <div className='machine'>
        <div className='slots'>
          {this.napraviSlot(7, this.state.kombinacija)}
          {this.pocniOdbrojavanje(this.props.onZavrsio)}
        </div>
      </div>
    );
  }
}

export default Drum;
