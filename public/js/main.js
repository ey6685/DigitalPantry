//DELETE ingredient request
//On document ready start
$(document).ready(function(){
    //Once DELETE button is clicked on showall_ingredients.pug trigger
    $('.delete-ingredient').on('click', function(e){
        //get button object clicked
        $target = $(e.target);
        //get data-id from the button
        const id = ($target.attr('data-id'));

        //Start AJAX
        $.ajax({
            type:'DELETE',
            //This route is defined under ingredients.js
            url:'/ingredients/remove/'+id,
            success:function(response){
                //route user back to results
                window.location.href = '/ingredients/showall';
            },
            error:function(err){
                console.log("Could not delete: "+id);
            }
        })
    });
});

//DELETE recipe request
//On document ready start
$(document).ready(function(){
    //Once DELETE button is clicked on showall_ingredients.pug trigger
    $('.delete-recipe').on('click', function(e){
        //get button object clicked
        $target = $(e.target);
        //get data-id from the button
        const id = ($target.attr('data-id'));

        //Start AJAX
        $.ajax({
            type:'DELETE',
            //This route is defined under ingredients.js
            url:'/recipes/remove/'+id,
            success:function(response){
                //route user back to results
                window.location.href = '/recipes/showall';
            },
            error:function(err){
                console.log("Could not delete: "+id);
            }
        })
    });
});

$(document).on('click','.delete-row',function() {
    $(this).closest('.form-row').remove();
});