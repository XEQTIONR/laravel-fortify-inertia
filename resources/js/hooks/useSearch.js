export default function useSearch() {
    function search(query, setIsLoading) {
        setIsLoading(true)
        const params = {
            //page,
            query
        }
        axios.get( route('api.search', { query }))
            .then(({data}) => {
                console.log(data);
            })
            .catch ( e => {
                console.log('search error', e)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return search;
}
