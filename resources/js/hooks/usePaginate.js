export default function usePaginate(route, setIsLoading, setRows, setMeta) {

    function paginate(page, perPage = null, orderBy = null, order = null) {
        setIsLoading(true);
        const params = {
            page,
            perPage,
            orderBy,
            order
        }
        axios.get( route, {
            params
        })
            .then( ({data, status}) => {
                if ( status === 200 ) {
                    setRows(data.data);
                    setMeta(data.meta);
                }
            })
            .catch( (e) => {
                console.log('pagination exception');
                console.log(e);
            })
            .finally(() => setIsLoading(false));
    }

    return paginate;

}
