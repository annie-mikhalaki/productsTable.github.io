import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Loading from './components/Loading';
import TryAgain from './components/TryAgain';
import Dialog from './components/DeleteDialog';
import Search from './components/Search'
import { AppDispatch } from './store/store';
import { fetchProducts, cleanProducts } from './reducers/productsReducer';
import { useSelector, useDispatch } from 'react-redux';

export interface ProductData {
  id: string;
  name: string;
  status: string;
  delivery_date: string;
  qty: number;
  volume: number;
  currency: string;
  sum: number;
}

type Order = 'asc' | 'desc';

function ProductsTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { products, loading } = useSelector((state: any) => state.products);
  const filteredProducts = search
    ? products.filter((product: ProductData) => product.name.toLowerCase().includes(search.toLowerCase()))
    : products
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(fetchProducts())
  }, []);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredProducts.map((n: ProductData) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleTableRowClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleSortClick = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  const handleTryAgainClick = () => {
    dispatch(fetchProducts())
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleContinue = () => {
    setOpen(false);
    setSelected([]);
    dispatch(cleanProducts(selected));
  }

  const sortProductsByDeliveryDate = (a: ProductData, b: ProductData) => {
    if (order === 'asc') {
      if (Date.parse(a.delivery_date) < Date.parse(b.delivery_date)) {
        return -1;
      }
      if (Date.parse(a.delivery_date) > Date.parse(b.delivery_date)) {
        return 1;
      }
    } else {
      if (Date.parse(a.delivery_date) > Date.parse(b.delivery_date)) {
        return -1;
      }
      if (Date.parse(a.delivery_date) < Date.parse(b.delivery_date)) {
        return 1;
      }
    }
    return 0;
  }

  const getSelectedProductNames = () => {
    return selected.map((item: string) => item = products.find((product: ProductData) => product.id === item).name)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const volumeCalculation = (products: ProductData[]) : number => {
    return products.reduce((accumulator: number, currentValue: ProductData) => accumulator + currentValue.volume, 0);
  }

  const quantityCalculation = (products: ProductData[]) : number => {
    return products.reduce((accumulator: number, currentValue: ProductData) => accumulator + currentValue.qty, 0);
  }

  const onSearch = (e: any): void => {
    setSearch(e.target.value)
  }

  const totalVolume = React.useMemo(() => volumeCalculation(products), [products]);
  const totalQuantity = React.useMemo(() => quantityCalculation(products), [products]);

  return (
    <>
      {
        (loading === 'pending' || loading === 'idle') &&
        <Loading />
      }
      {
        loading === 'failed' &&
        <TryAgain onClick={handleTryAgainClick}/>
      }
      {
        loading === 'succeeded' &&
        <Box>
          <Paper>
            <Box display="flex" justifyContent="space-between">
              <Toolbar>
                <Typography variant="h6" fontWeight="bold">Товары</Typography>
              </Toolbar>
              <Search onSearch={onSearch}/>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" onChange={handleSelectAllClick} />
                    </TableCell>
                    <TableCell key='name' align="left" padding="none"><Typography  fontWeight="bold">Название</Typography></TableCell>
                    <TableCell key='status' align="center"><Typography fontWeight="bold">Статус</Typography></TableCell>
                    <TableCell key='delivery_date' align="center">
                      <TableSortLabel onClick={handleSortClick}><Typography fontWeight="bold">Дата доставки</Typography></TableSortLabel>
                    </TableCell>
                    <TableCell key='qty' align="center"><Typography fontWeight="bold">Количество</Typography></TableCell>
                    <TableCell key='volume' align="center"><Typography fontWeight="bold">Объем</Typography></TableCell>
                    <TableCell key='currency' align="center"><Typography fontWeight="bold">Валюта</Typography></TableCell>
                    <TableCell key='sum' align="center"><Typography fontWeight="bold">Сумма</Typography></TableCell>
                    <TableCell key='total' align="center"><Typography fontWeight="bold">Всего</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    [...filteredProducts]
                      .sort(sortProductsByDeliveryDate)
                      .map((row: ProductData) => {
                        const isItemSelected = isSelected(row.id)
                        return (
                          <TableRow
                            onClick={(event) => handleTableRowClick(event, row.id)}
                            tabIndex={-1} key={row.name} hover
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox"><Checkbox color="primary" checked={isItemSelected} /></TableCell>
                            <TableCell component="th" scope="row" padding="none">{row.name}</TableCell>
                            <TableCell align="center">{row.status}</TableCell>
                            <TableCell align="center">{row.delivery_date}</TableCell>
                            <TableCell align="center">{row.qty}</TableCell>
                            <TableCell align="center">{row.volume}</TableCell>
                            <TableCell align="center">{row.currency}</TableCell>
                            <TableCell align="center">{row.sum}</TableCell>
                            <TableCell align="center">{row.sum * row.qty}</TableCell>
                          </TableRow>
                        )
                      })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={1} display="flex" justifyContent="space-between">
              <Box>
                <Typography fontWeight="bold">{`Общий объем: ${totalVolume}`}</Typography>
                <Typography fontWeight="bold">{`Общее количество: ${totalQuantity}`}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                { selected.length > 0 && <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleClickOpen}>Аннулировать</Button>}
                <Dialog open={open} onCancel={handleClose} onContinue={handleContinue} selectedProductNames={getSelectedProductNames()}></Dialog>
              </Box>
            </Box>
          </Paper>
        </Box>
      }
    </>
  );
}

export default ProductsTable
