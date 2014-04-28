$( document ).ready(function() {
    $(".checkbox").click(function () {
        console.log($(this).attr("value"));
        console.log($(this).attr("action"));
        debugger;
        $.post($(this).attr("action"), { identifier: $(this).attr("value")});
    });
});