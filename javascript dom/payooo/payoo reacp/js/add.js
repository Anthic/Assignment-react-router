document.getElementById('btn-add') 
    .addEventListener('click', function(event){
        //prevent page loader form tag
        event.preventDefault(); 
        //take money
        const addMoney= document.getElementById('add-amount').value;
        //take pin
        const addPin= document.getElementById('add-pin').value;
        //apply the condition
        if (addPin === '1234') {
            console.log('mama kaj hoye geche');
            //catch the main number
            const mainAmount= document.getElementById('main-amount').innerText;
            const newMainAmount= parseFloat(mainAmount)
            //addMoney convert string to number
            const newMoney= parseFloat(addMoney)
            //total calulation
            const totalAmount = newMainAmount+ newMoney
            // update the result
            document.getElementById('main-amount').innerText= totalAmount;
        }else{
            alert('mama tmi vull korcho')
        }
    })