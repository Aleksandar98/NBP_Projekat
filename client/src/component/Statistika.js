import * as React from 'react';
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

let data = [
  { kolo: "1", novac_koji_firma_primi: 1000, isplate_korisnicima: 1500 },
  { kolo: "2", novac_koji_firma_primi: 4200, isplate_korisnicima: 1100 },
  { kolo: "3", novac_koji_firma_primi: 5354, isplate_korisnicima: 1200 },
  { kolo: "4", novac_koji_firma_primi: 3900, isplate_korisnicima: 1150 },
  { kolo: "5", novac_koji_firma_primi: 9105, isplate_korisnicima: 2500 },
  { kolo: "6", novac_koji_firma_primi: 4180, isplate_korisnicima: 2250 },
  { kolo: "7", novac_koji_firma_primi: 8110, isplate_korisnicima: 1600 },
  { kolo: "8", novac_koji_firma_primi: 2554, isplate_korisnicima: 2200 },
  { kolo: "9", novac_koji_firma_primi: 888, isplate_korisnicima: 2560 },
  // { kolo: "10", novac_koji_firma_primi: 14270, isplate_korisnicima: 1130 },
];

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

const isplati = () => {
  axios.post('/izvrsiIsplatu');
}

export default class Statistika extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/izracunajProfit")
      .then((res) => res.json())
      .then(
        (result) => {
          let podaci = [
            {
              kolo: "1",
              novac_koji_firma_primi: 1000,
              isplate_korisnicima: 1500,
            },
            {
              kolo: "2",
              novac_koji_firma_primi: 4200,
              isplate_korisnicima: 1100,
            },
            {
              kolo: "3",
              novac_koji_firma_primi: 5354,
              isplate_korisnicima: 1200,
            },
            {
              kolo: "4",
              novac_koji_firma_primi: 3900,
              isplate_korisnicima: 1150,
            },
            {
              kolo: "5",
              novac_koji_firma_primi: 9105,
              isplate_korisnicima: 2500,
            },
            {
              kolo: "6",
              novac_koji_firma_primi: 4180,
              isplate_korisnicima: 2250,
            },
            {
              kolo: "7",
              novac_koji_firma_primi: 8110,
              isplate_korisnicima: 1600,
            },
            {
              kolo: "8",
              novac_koji_firma_primi: 2554,
              isplate_korisnicima: 2200,
            },
            {
              kolo: "9",
              novac_koji_firma_primi: 888,
              isplate_korisnicima: 2560,
            },
          ];
          podaci.push({
            kolo: "10",
            novac_koji_firma_primi: result[0],
            isplate_korisnicima: result[1],
          });
          this.setState({ data: podaci });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  render() {
    const { data: chartData } = this.state;

    return (
      <div className="card">
        <Chart data={chartData} className="pr-3">
          <ArgumentScale factory={scalePoint} />
          <ArgumentAxis />
          <ValueAxis />

          <AreaSeries
            name="Novac koji firma primi"
            valueField="novac_koji_firma_primi"
            argumentField="kolo"
            seriesComponent={Area}
          />
          <AreaSeries
            name="Isplate korisnicima"
            valueField="isplate_korisnicima"
            argumentField="kolo"
            seriesComponent={Area}
          />
          <Animation />
          <Legend position="bottom" rootComponent={Root} />
          <Title text="Profit firme Loto" />
          
        </Chart>
        <div onClick = {() => {isplati()}} id='isplata' className='btn btn-primary'>Isplati dobitke</div>
      </div>
    );
  }
}
