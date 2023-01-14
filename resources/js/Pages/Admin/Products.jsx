import { useEffect, useState } from 'react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function Products({ products }) {

    const [isLoading, setIsLoading] = useState(false)
    const [rows, setRows] = useState(products);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90
        },
        {
            field: 'english_name',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'bangla_name',
            headerName: 'Name (Bangla)',
            width: 150,
            editable: true,
        },
        {
            field: 'current_selling_price',
            headerName: 'Current Price',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'in_stock',
            headerName: '# in stock',
            sortable: true,
            width: 160,
        },
    ];
    useEffect(() => {
        if ( ! window.localStorage.getItem('api-token') ) {
            axios.get(route('admin.token'), { headers: { Accept: 'application/json' } })
                .then(({data}) => {
                    data && window.localStorage.setItem('api-token', data);
                })
                .catch( (e) => {
                    console.log('error');
                    console.log(e);
                });
        }
    });

    function paginate(page, perPage = null, orderBy = null, order = null) {
        setIsLoading(true);
        const params = {
            page,
            perPage,
            orderBy,
            order
        }
        axios.get( route('api.products.index'), {
            headers: {
              Authorization: 'Bearer ' + window.localStorage.getItem('api-token'),
            },
            params
        })
        .then( ({data, status}) => {
            if ( status === 200 ) {
                setRows(data);
            }
        })
        .catch( (e) => {
            console.log('pagination exception');
            console.log(e);
        })
        .finally(() => setIsLoading(false));

    }
    return (
        <Nav navLinks={ navItems }>
            <DataGrid
                checkboxSelection
                columns={ columns }
                disableColumnMenu
                disableSelectionOnClick
                experimentalFeatures={ { newEditingApi: true } }
                loading={ isLoading }
                onPageSizeChange={ (newPageSize) =>
                    paginate(rows.meta.current_page, newPageSize, rows.meta.orderBy, rows.meta.order)
                }
                onPageChange={ (newPage) =>
                    paginate(newPage+1, rows.meta.per_page, rows.meta.orderBy, rows.meta.order)
                }
                onSortModelChange={ ([gridSortItem]) => {
                    if(gridSortItem) {
                        paginate(rows.meta.current_page, rows.meta.per_page, gridSortItem.field, gridSortItem.sort)
                    }
                }}
                pageSize={ rows.meta.per_page }
                paginationMode="server"
                rows={ rows.data }
                rowCount={ rows.meta.total }
                rowsPerPageOptions={ [5, 10, 25, 50, 100].filter((perPage) => rows.meta.total >= perPage) }
                sortingMode="server"
            />
        </Nav>
    )
}
