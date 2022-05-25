//MODEL

//numbers array
let numbers = [];
let keyLinks = [];

//populates array with random numbers in range
const populateArray = (min, max, length) =>{
    //first reset arrays
    numbers = [];
    keyLinks = [];
    for(let i = 0; i < length; i++){
        const rand = Math.floor(Math.random() * (max - min + 1) + min);
        numbers.push(rand);
        keyLinks.push(i);
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

        swapKeyLinks(i, minIndex);        
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

                swapKeyLinks(j + 1, j);

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

                swapKeyLinks(j, j - 1);
            }
            else{
                moves.push([j, j - 1, false]);
            }

        }
    }
    return moves;
}

//swaps keyLinks
const swapKeyLinks = (i, j) =>{
    const temp = keyLinks[i];
    keyLinks[i] = keyLinks[j];
    keyLinks[j] = temp;
}

//VIEW

//redners array to be displayed
const renderArray = () =>{

    //first clear the container
    $("#main-container").empty();

    //height multiplier for the bars
    const heightMultiplier = 4;
    const size = numbers.length;

    //loops through all numbers in array and display's it in the container
    numbers.forEach((num, index) =>{
    
        const markup = `
            <div class="bar" id="${index}">${size < 25 ? num : ''}<div>
        `;

        //add bar to container
        const bar = $(markup);
        $("#main-container").append(bar);

        //style bar
        bar.css("height", "" + num * heightMultiplier + "px");
    
    setBarWidth(size);

    });
}

const setBarWidth = size => {
    let barWidth = Math.floor(700 / size);
    $(".bar").css("width", "" + barWidth + "px");
}

//sets a different color in bars that are in their final position (sorted)
const renderFinalColor = (bars) =>{
    keyLinks.forEach((keyLink, i) => {
        if(bars[i].id === ''+ keyLink){
            renderBarStyle([bars[i]], "purple");
        }

    });
}

/*NOTE: the moves array stores all the scans and swaps done on the 
numbers array while sorting.
the third element in each of the moves is a bool that states if that move is a swap or a scan
true: swap, false: scan
*/
//handles rendering of sorting - recursive
const renderSort = async (index, moves, bars, animationTime) =>{

    renderFinalColor(bars);

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

        bar1.animate({left: '-=' + (diff * bar1.outerWidth()) + 'px'}, animationTime, () =>{
            bar1.insertBefore(bar2);
            renderBarStyle([bar1], "red", "0", "0px");
        });

        bar2.animate({left: '+=' + (diff * bar2.outerWidth()) + 'px'}, animationTime, () =>{
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
    //min, max, length - default generation
    const min = 5;
    const max = 130;
    populateArray(min, max, 10);
    renderArray();

    //when swap button is pressed
    $("#sort-button").off().on("click", function(){

        //disable all other inputs
        toggleInputs(true);
        
        //getting type of algorithm 
        let moves = [];
        if(algorithm !== null){
            if(algorithm === "bubble-sort-button")  moves = bubbleSort();
            else if(algorithm === "selection-sort-button")  moves = selectionSort();
            else if(algorithm === "insertion-sort-button")  moves = insertionSort();
        }
        else{
            alert("pick an algorithm");
            return;
        }

        //get main container and its children - using vanialla js because jquery .children() is not working
        const container = document.getElementById('main-container');
        const children = container.children;    

        console.log(keyLinks);

        //animation time
        const arrSize = numbers.length;
        //if arr size is high, animationtime is low
        const animationTime = Math.floor(1000 / arrSize);
        //render sort
        renderSort(0, moves, children, animationTime);

    });

    //function handles the selection of algorithm type
    let algorithm = null;
    $("div.alg-select-button").click(function(){
        //toggles class so the button clicked can be styled
        $("div.alg-select-button-active").removeClass("alg-select-button-active");
        $(this).toggleClass("alg-select-button-active");
        //getting id of selected element
        algorithm = $(this).attr("id");
    });

    //array size input handler - fired when input is changed
    $("#array-size-input").on("input change", function(){
        //everytime the input is changed, a new array is generated
        const size = parseInt($(this).val());
        populateArray(min, max, size);
        renderArray();
        
    });

    //generate arr button handler
    $("#generate-arr-button").click(function(){
        const size = parseInt($("#array-size-input").val());
        populateArray(min, max, size);
        renderArray();

    });
    

});

const toggleInputs = disabled => {
    $("#generate-arr-button").attr("disabled", disabled);
    $("#sort-button").attr("disabled", disabled);
    $("#array-size-input").attr("disabled", disabled);

    $("div.alg-select-button").attr("disabled", disabled);
    $("#div.alg-select-button").css('pointer-events','none');
}