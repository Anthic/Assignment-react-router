document.getElementById('cash-out')
    .addEventListener('click', function(){
        document.getElementById('cash-out-form').classList.remove('hidden')
        document.getElementById('cash-add').classList.add('hidden')
    })

document.getElementById('add-button-one')
    .addEventListener('click',function(){
        document.getElementById('cash-add').classList.remove('hidden')
        document.getElementById('cash-out-form').classList.add('hidden')
      


    })