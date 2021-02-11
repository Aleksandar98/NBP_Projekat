import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  AreaSeries,
  Title,
  Legend,
} from '@devexpress/dx-react-chart-bootstrap4';
import { ArgumentScale, Animation } from '@devexpress/dx-react-chart';
import { curveCatmullRom, area } from 'd3-shape';
import { scalePoint } from 'd3-scale';
import axios from 'axios';
import swal from 'sweetalert';

const Root = (props) => <Legend.Root {...props} className='m-auto flex-row' />;

const Area = (props) => (
  <AreaSeries.Path
    {...props}
    path={area()
      .x(({ arg }) => arg)
      .y1(({ val }) => val)
      .y0(({ startVal }) => startVal)
      .curve(curveCatmullRom)}
  />
);
export default class Statistika extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      vrednost: '',
    };
  }

  async okini() {
    if (this.state.vrednost <= 0) this.state.vrednost = 5000;
    const res = await axios.put('http://localhost:5000/vrednostSedmice', {
      vrednostSedmice: this.state.vrednost,
    });
    swal('Uspesno azurirana vrednost sedmice!');
  }

  componentDidMount() {
    fetch('http://localhost:5000/vratiStatistiku', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((podaci) => {
        const data = podaci;
        data.forEach((obj) => {
          obj.isplata = parseInt(obj.isplata);
          obj.uplaceno = parseInt(obj.uplaceno);
        });
        data.sort(function (a, b) {
          return a.idkola - b.idkola;
        });
        this.setState({ ...this.state, data });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { data: chartData } = this.state;

    return !this.state.data[0] ? (
      <div className='lotoo'>
        <h1 className='klasa8'>Ne postoje podaci ni za jedno kolo u bazi</h1>
        <div className='lotooo'>
          <label for='unos'>Unesi vrednost sedmice</label>
          <input
            type='number'
            value={this.state.vrednost}
            onChange={(e) =>
              this.setState({ ...this.state, vrednost: e.target.value })
            }
          />
          <button type='submit' onClick={() => this.okini()}>
            Submit
          </button>
        </div>
      </div>
    ) : (
      <div className='card'>
        <Chart data={chartData} className='pr-3'>
          <ArgumentScale factory={scalePoint} />
          <ArgumentAxis />
          <ValueAxis />

          <AreaSeries
            name='Novac koji firma primi'
            valueField='uplaceno'
            argumentField='idkola'
            seriesComponent={Area}
          />
          <AreaSeries
            name='Isplate korisnicima'
            valueField='isplata'
            argumentField='idkola'
            seriesComponent={Area}
          />
          <Animation />
          <Legend position='bottom' rootComponent={Root} />
          <Title text='Profit firme Loto' />
        </Chart>
        <div className='lotooo1'>
          <label for='unos'>
            Unesi vrednost sedmice za tekuce kolo &nbsp; &nbsp;
          </label>
          <input
            type='number'
            value={this.state.vrednost}
            onChange={(e) =>
              this.setState({ ...this.state, vrednost: e.target.value })
            }
          />
          <button type='submit' onClick={() => this.okini()}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}
