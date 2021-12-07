
export const LinkHelper = function(url, queryString, props){
    if(queryString === undefined || !queryString){
        queryString = '';
    }

    props.history.push({
        pathname: url,
        search: queryString,
    });
}