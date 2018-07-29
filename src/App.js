import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { getInitialFlightData } from './DataProvider';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: getInitialFlightData()
    };

    this.columns = [
      {
        Header: 'Origin',
        accessor: 'origin'
      },
      {
        Header: 'Flight',
        accessor: 'flight'
      },
      {
        Header: 'Arrival',
        accessor: 'arrival'
      },
      {
        Header: 'State',
        accessor: 'state'
      }
    ];

    this.eventSource = new EventSource('http://localhost:5000/events');
  }

  componentDidMount() {
    console.log('mounted');

    this.eventSource.onmessage = e => {
      console.log(e.data);

      this.eventSource.addEventListener('flightStateUpdate', e => {
        console.log('update');
        this.updateFlightState(JSON.parse(e.data));
      });
      this.eventSource.addEventListener('flightRemoval', e => {
        console.log('remove');
        this.removeFlight(JSON.parse(e.data));
      });
    };
  }

  updateFlightState(flightState) {
    console.log(flightState);
    let newData = this.state.data.map(item => {
      if (item.flight === flightState.flight) {
        item.state = flightState.state;
      }

      return item;
    });

    this.setState(Object.assign({}, { data: newData }));
  }

  removeFlight(flightInfo) {
    console.log(flightInfo);
    const newData = this.state.data.filter(
      item => item.flight !== flightInfo.flight
    );

    this.setState(Object.assign({}, { data: newData }));
  }

  render() {
    return (
      <div className="App">
        <ReactTable data={this.state.data} columns={this.columns} />
      </div>
    );
  }
}

export default App;
