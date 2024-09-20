document.getElementById('btn-out')
.addEventListener('click', function(event){
    //prevent page loader form tag
    event.preventDefault(); 
            //out money
            const outMoney= document.getElementById('out-amount').value;
            //take pin
            const givePin= document.getElementById('out-pin').value;
                    //apply the condition
        if (givePin === '1234') {
            console.log('mama kaj hoye geche');
            //catch the main number
            const mainOutAmount= document.getElementById('main-amount').innerText;
            const newOutMainAmount= parseFloat(mainOutAmount)
            //addMoney convert string to number
            const newOutMoney= parseFloat(outMoney)
            //total calulation
            const totalOutAmount = newOutMainAmount - newOutMoney
            // update the result
            document.getElementById('main-amount').innerText= totalOutAmount;
        }else{
            alert('mama tmi vull korcho')
        }
}) 