$( document ).ready( function () {
    $.ajaxSetup( {
        headers: {
            'X-CSRF-Token': $( 'meta[name="csrf-token"]' ).attr( 'content' )
        }
    } );
    
    $( ".checkbox" ).click( function () {
        console.log( $( this ).attr( "value" ) );
        console.log( $( this ).attr( "action" ) );
        debugger;
        $.post( $( this ).attr( "action" ), { identifier: $( this ).attr( "value" ) } );
    } );
    
    $( "button#persona-login" ).click( function ( e ) {
        e.preventDefault( );
        navigator.id.get( function ( assertion ) {
            if ( assertion ) {
                $( "form#persona-form>input" ).val( assertion );
                $( "form#persona-form" ).submit( );
            } else {
                location.reload( );
            }
        } );
    } );
} );