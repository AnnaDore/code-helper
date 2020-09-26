document.addEventListener('DOMContentLoaded', () => {

 // console.log('IronGenerator JS imported successfully!');

}, false);


/* //search code
let showResults = debounce(function(arg) {
let value = arg.trim()
if (value == "" || value.length <= 0) {
    $("#search-results").fadeOut()
    return
}
else {
    $("#search-results").fadeIn()
}
let jqxhr = $.get('/xhr/search?q=' + value, function(data) {
    $("#search-results").html("")
})
.done(function(data) {
    if (data.length === 0) {
        $("#search-results").append('<p class="lead text-center mt-2>No results</p>')
    } else {
        data.forEach(x => {
            $("#search-results").append('<a href="#"><pp class="m-2 lead">' + x.name + '</p> </a>') // here
        })
    }
})
.fail(function(err) {
    console.log(err)
})
}, 200);

function debounce(func, wait, immediate) {
    let timeout
    return function() {
        let content = this,
        args = arguments
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(content, args)
        }
        let callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }

} */