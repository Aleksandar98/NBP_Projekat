import React from 'react';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

function createData(brPogodaka, brDobitnika) {
  return { brPogodaka, brDobitnika};
}

const rows = [
  createData(7, 0),
  createData(6, 1),
  createData(5, 15),
  createData(4, 15335),
  createData(3, 1123434)
];
const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});
export default function BasicTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <StyledTableRow >
            <StyledTableCell>Broj pogodaka</StyledTableCell>
            <StyledTableCell >Broj dobitnika</StyledTableCell>
          </StyledTableRow >
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.brPogodaka}>
              <StyledTableCell component="th" scope="row">
              {row.brPogodaka}
              </StyledTableCell>
              
              <StyledTableCell >{row.brDobitnika}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}