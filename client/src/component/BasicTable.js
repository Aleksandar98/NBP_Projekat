import React, { Component } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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
    "&:nth-of-type(odd)": {
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
    this.state = { izvlacenja: [] };
  }

  createData(brPogodaka, brDobitnika) {
    return { brPogodaka, brDobitnika };
  }

  componentDidMount() {
    fetch("http://localhost:5000/vratiDobitke")
      .then((res) => res.json())
      .then(
        (result) => {
          for (let i = 0; i < 5; i++) {
            rows.push(this.createData(7 - i, result[i]));
          }
          this.setState({ izvlacenja: rows });
          console.log(rows);
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

  popunitabelu() {}

  render() {
    const classes = this.props.classes;
    this.popunitabelu();
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Broj pogodaka</StyledTableCell>
              <StyledTableCell>Broj dobitnika</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.brPogodaka}>
                <StyledTableCell component="th" scope="row">
                  {row.brPogodaka}
                </StyledTableCell>

                <StyledTableCell>{row.brDobitnika}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default () => {
  const classes = useStyles();
  return <BasicTable classes={classes} />;
};
