$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(".checkbox").click(function () {
        console.log($(this).attr("value"));
        console.log($(this).attr("action"));
        debugger;
        $.post($(this).attr("action"), { identifier: $(this).attr("value")});
    });
});