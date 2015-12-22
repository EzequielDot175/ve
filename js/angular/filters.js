app.filter('reverse', function() {
    return function(input) {


        var result = "";
        var explode = input.split(".");
        var first = explode[0].replace(/,/ig,".");
        var second = "";

        result = first;
        if (explode[1] != undefined) {
            second = ","+explode[1];
            result += second;
        }
        return result;
    };
})