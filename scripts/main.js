//MODEL

//numbers array
const numbers = []

//populates array with random numbers in range
const populateArray = (min, max, length) =>{
    for(let i = 0; i < length; i++){
        const rand = Math.floor(Math.random() * (max - min + 1) + min);
        numbers.push(rand);
    }
}

//recursive merge sort
let mov = [];
const mergeSort = (array) => {

    //base case
    if(array.length <= 1){
        return array;
    }
    //recusrive case

    const mid = Math.floor(array.length / 2);

    let left = array.slice(0, mid);
    left = mergeSort(left);

    let right = array.slice(mid, array.length);
    right = mergeSort(right);

    return mergeArrays(left, right);

}
//helper merge method for mergeSort
const mergeArrays = (arr1, arr2) => {
    const merged = [];
    let i1 = 0;
    let i2 = 0;

    while(true){
        if(arr1[i1] < arr2[i2]){
            merged.push(arr1[i1]);
            i1++;

            if(i1 == arr1.length){
                for(let i = i2; i < arr2.length; i++){
                    merged.push(arr2[i]);
                }
                break;
            }
        }
        else{
            merged.push(arr2[i2]);
            i2++;

            if(i2 == arr2.length){
                for(let i = i1; i < arr1.length; i++){
                    merged.push(arr1[i]);
                }
                break;
            }
        }     
        
    }
    console.log(merged);
    return merged;
}


//selection sort algortihm
const selectionSort = () =>{
    //arr to store all the moves
    let moves = [];

    for(let i = 0; i < numbers.length; i++){
        let minIndex = i;
        for(let j = minIndex + 1; j < numbers.length; j++){
            if(numbers[j] < numbers[minIndex]){
                minIndex = j;
            }
            moves.push([i, j, false]);
            
        }
        //swapping nodes as well
        //using var because it can be re-declared
        const temp = numbers[i];
        numbers[i] = numbers[minIndex];
        numbers[minIndex] = temp;
        moves.push([i, minIndex, true]);

        
    }   
    return moves;
}


const bubbleSort = () =>{
    //arr to store all the moves
    let moves = [];

    for(let i = 0; i < numbers.length; i++){
        for(let j = 0; j < numbers.length - i; j++){
            if(numbers[j] > numbers[j + 1]){
                //swap
                const temp = numbers[j + 1];
                numbers[j + 1] = numbers[j];
                numbers[j] = temp;
                moves.push([j, j + 1, true]);
            }
            else{
                moves.push([j, j + 1, false]);
            }
        }
    }
    return moves;
}

const insertionSort = () =>{
    //arr to store all the moves
    let moves = [];

    for(let i = 1; i < numbers.length; i++){
        for(let j = i; j > 0; j--){
            if(numbers[j] < numbers[j - 1]){
                //swap
                const temp = numbers[j];
                numbers[j] = numbers[j - 1];
                numbers[j - 1] = temp;
                moves.push([j, j - 1, true]);
            }
            else{
                moves.push([j, j - 1, false]);
            }

        }
    }
    return moves;
}

//VIEW

//redners array to be displayed
const renderArray = () =>{

    //height multiplier for the bars
    const heightMultiplier = 10;

    //loops through all numbers in array and display's it in container
    numbers.forEach(num =>{
    
        const markup = `
            <div class="bar">${num}<div>
        `;

        //add bar to container
        const bar = $(markup);
        $("#main-container").append(bar);

        //style bar
        bar.css("height", "" + num * heightMultiplier + "px");

    });
}

/*NOTE: the moves array stores all the scans and swaps done on the 
numbers array while sorting.
the third element in each of the moves is a bool that states if that move is a swap or a scan
true: swap, false: scan
*/
//handles rendering of sorting - recursive
const renderSort = async (index, moves, bars, animationTime) =>{

    //base case
    if(index >= moves.length){
        return;
    }

    //recursive case

    //getting bars from index values out of moves
    let bar1 = bars[moves[index][0]];
    let bar2 = bars[moves[index][1]];
    //converting html elements to jquery objects
    bar1 = $(bar1);
    bar2 = $(bar2);

    //if true, swap
    if(moves[index][2]){
        //setting css properties before animation
        renderBarStyle([bar1, bar2], "red", "0", "0px");
        //using async/await and timeout functions to achieve delay
        setTimeout(async () => {
            renderBarStyle([bar1, bar2], "aqua", "0", "0px");

            setTimeout(async () => {
                //awaiting animation to be over
                await swapBars(bar1, bar2, animationTime);

                setTimeout(() =>{
                    renderBarStyle([bar1, bar2], "green", "0", "0px");
                    //recurse    
                    renderSort(index + 1, moves, bars, animationTime);

                }, animationTime);

            }, animationTime);

        }, animationTime);
        
        
    }
    //if false, scan
    else{
        renderBarStyle([bar1, bar2], "red", "0", "0px");
        setTimeout(() =>{
            renderBarStyle([bar1, bar2], "green", "0", "0px");
            //recurse
            renderSort(index + 1, moves, bars, animationTime);
        }, animationTime);
    }
}

//swaps two bars
const swapBars = (bar1, bar2, animationTime) =>{
    //return new promise
    return new Promise((resolve) => {
        bar1 = $(bar1);
        bar2 = $(bar2);
        //temproprary element (right sibling of bar1)
        const sibling = bar1.next().is(bar2) ? bar1 : bar1.next();

        //swap bars and animate them---->
        const diff = (bar1.index() - bar2.index());

        bar1.animate({left: '-=' + (diff * 22) + 'px'}, animationTime, () =>{
            bar1.insertBefore(bar2);
            renderBarStyle([bar1], "red", "0", "0px");
        });

        bar2.animate({left: '+=' + (diff * 22) + 'px'}, animationTime, () =>{
            bar2.insertBefore(sibling);
            renderBarStyle([bar2], "red", "0", "0px"); 

            //promise resolved after this code before this runs
            resolve(true);
        });
    });
    
}

//renders bar styles(color, pos, etc)
const renderBarStyle = (bars, bgColor, zInd, posLeft) =>{
    bars.forEach(bar =>{
        bar = $(bar);
        bar.css({
            backgroundColor: bgColor,
            zIndex: zInd,
            left: posLeft
        });
    });
}


//CONTROLLER

//after page is fully loaded
$(document).ready(function(){
                //min, max, length
    populateArray(1, 40, 5);
    renderArray();

    //when swap button is pressed
    $("#sort-button").off().on("click", function(){
        //get main container and its children - using vanialla js because jquery .children() is not working
        const container = document.getElementById('main-container');
        const children = container.children;    
        
        const c = list(children);

        const moves = bubbleSort();
        //animation time
        const animationTime = 100;
        renderSort(0, moves, children, animationTime);

    });

});
