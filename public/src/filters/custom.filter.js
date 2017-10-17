app.filter('filter', () => {
    return (items, params) => {
        if (!params.searchText)
            return items;

        var newItems = JSON.parse(JSON.stringify(items)),
            result = [],
            searchText = params.caseSensetive ? params.searchText : params.searchText.toLowerCase(),
            searchOptions = (params.searchBy !== 'any') ? [params.searchBy] : params.searchOptions;

        newItems.forEach(function (item, i) {
            var outerFlag = false;

            searchOptions.forEach(function (option) {
                var innerFlag;
                item[option] = params.caseSensetive ? item[option] : item[option].toLowerCase();
                innerFlag = params.fullMatch ? (item[option] === searchText) : (item[option].indexOf(searchText) > -1);
                if (innerFlag) {
                    outerFlag = true;
                    return;
                }
            });

            outerFlag = params.negative ? !outerFlag : outerFlag;
            outerFlag ? result.push(items[i]) : '';
        });

        return result;
    };
});
