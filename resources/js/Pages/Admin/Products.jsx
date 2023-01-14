import { useEffect, useState } from 'react';
import Nav from '@/Components/Admin/Nav';
import navItems from  '@/Components/data/AdminNavItems';
import { DataGrid } from '@mui/x-data-grid';

export default function Products({ products }) {

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

    const [isLoading, setIsLoading] = useState(false)
    const [rows, setRows] = useState(products);

    function paginate(page, perPage = null) {
        setIsLoading(true);
        axios.get( route('api.products.index'),
            {
                headers: {
                  Authorization: 'Bearer ' + window.localStorage.getItem('api-token'),
                },
                params: {
                    page,
                    perPage: perPage ?? rows.meta.per_page,
                }
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

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90
        },
        {
            field: 'englishName',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'banglaName',
            headerName: 'Name (Bangla)',
            width: 150,
            editable: true,
        },
        {
            field: 'currentSellingPrice',
            headerName: 'Current Price',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'inStock',
            headerName: '# in stock',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            // valueGetter: (params) =>
            //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];
    return (
        <Nav navLinks={navItems}>

                <DataGrid
                    checkboxSelection
                    columns={columns}
                    loading={isLoading}
                    onPageSizeChange={(newPageSize) => paginate(rows.meta.current_page, newPageSize)}
                    onPageChange={(newPage) => paginate(newPage+1)}
                    pageSize={rows.meta.per_page}
                    paginationMode="server"
                    rows={rows.data}
                    rowCount={rows.meta.total}
                    rowsPerPageOptions={[5, 10, 25, 50, 100].filter((perPage) => rows.meta.total >= perPage)}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                />

        </Nav>
    )
}
