import React, { Component, Fragment } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Blink from 'react-blink-text';
import axios from 'axios';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
let rows = [];
const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

class BasicTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      izvlacenja: [],
      kombinacija: [],
      sedmica: '',
      vrednosti: [],
    };
  }

  createData(brPogodaka, brDobitnika) {
    return { brPogodaka, brDobitnika };
  }

  componentDidMount() {
    fetch('http://localhost:5000/vratiDobitke')
      .then((res) => res.json())
      .then(
        (result) => {
          for (let i = 0; i < 5; i++) {
            rows.push(this.createData(7 - i, result[i]));
          }
          this.setState({ izvlacenja: rows });
          console.log(rows);
        },

        (error) => {
          console.log(error);
        }
      );

    fetch('http://localhost:5000/vratiKombinaciju')
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({ kombinacija: result });
          console.log(result);
        },

        (error) => {
          console.log(error);
        }
      );
    fetch('http://localhost:5000/vratiVrednostSedmice')
      .then((res) => res.json())
      .then((data) => this.setState({ ...this.state, sedmica: data }));
  }

  popunitabelu() {}

  vratiSredjenNiz() {
    var niz = this.state.kombinacija;
    var sredjenNiz = '';
    for (var i = 0; i < 7; i++) {
      sredjenNiz += ' ' + niz[i];
    }
    return sredjenNiz;
  }

  render() {
    const classes = this.props.classes;
    this.popunitabelu();
    return (
      <Fragment>
        <h1>Rezultati prethodnog kola</h1>

        <h3>
          Dobtina kombinacija :{' '}
          <Blink
            color='red'
            text={this.vratiSredjenNiz()}
            fontSize='30'
          ></Blink>{' '}
        </h3>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Broj pogodaka</StyledTableCell>
                <StyledTableCell>Broj dobitnika</StyledTableCell>
                <StyledTableCell>Vrednost isplate</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={row.brPogodaka}>
                  <StyledTableCell component='th' scope='row'>
                    {row.brPogodaka}
                  </StyledTableCell>

                  <StyledTableCell>{row.brDobitnika}</StyledTableCell>
                  <StyledTableCell>
                    {i == 0
                      ? this.state.sedmica
                      : i == 1
                      ? parseInt(this.state.sedmica) * 0.1
                      : i == 2
                      ? parseInt(this.state.sedmica) * 0.05
                      : i == 3
                      ? 1000
                      : 100}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fragment>
    );
  }
}

export default () => {
  const classes = useStyles();
  return <BasicTable classes={classes} />;
};
