//MODEL
//main numbers array
let numbers = [];
//stores numbers from 0 -> length of numbers - each number is a permanent index given to a number
let keyLinks = [];

//populates array with random numbers in range
function populateArray(min, max, length){
    //first reset arrays
    numbers = [];
    keyLinks = [];
    for(let i = 0; i < length; i++){
        const rand = Math.floor(Math.random() * (max - min + 1) + min);
        numbers.push(rand);
        keyLinks.push(i);
    }
}

function mergeSort(array){
    let moves = [];
    array = array.slice(0);//makes copy of array

    //encode premanent index values to each number in array
    const out = mergeSortHelper(array.map((num, index) => [num, index]), moves);
    const sortedArr = out.map(num => num[0]);

    //configures keyLinks
    keyLinks = [];
    const bars = document.getElementById("main-container").children;
    for(let i = 0; i < out.length; i++){
        keyLinks.push(out[i][1]);
    }
    return moves;
}

//recursive merge sort
function mergeSortHelper(array, moves){
    //base case
    if(array.length <= 1){
        return array;
    }
    //recursive case
    const splitIndex = Math.floor(array.length / 2);
    
    let leftSplit = array.slice(0, splitIndex);
    let rightSplit = array.slice(splitIndex);

    let left = mergeSortHelper(leftSplit, moves);
    let right = mergeSortHelper(rightSplit, moves);

    return mergeArrays(left, right, moves);
}

function mergeArrays(arr1, arr2, moves) {
    let merged = [];
    let i1 = 0;
    let i2 = 0;

    while(true){
        
        if(arr1[i1][0] < arr2[i2][0]){
            merged.push(arr1[i1]);
            //using encoded index values to determine the values needed to be inserted
            moves.push([arr2[i2][1], arr1[i1][1], false, true]);

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
            //using encoded index values to determine the values needed to be inserted
            moves.push([arr2[i2][1], arr1[i1][1], true, true]);

            i2++;

            if(i2 == arr2.length){
                for(let i = i1; i < arr1.length; i++){
                    merged.push(arr1[i]);
                    
                }
                break;
            }
        }     
        
    }   
    return merged;
}


function bubbleSort(array){
    //arr to store all the moves
    let moves = [];
    array = array.slice(0);//makes copy of array

    for(let i = 0; i < array.length; i++){
        for(let j = 0; j < array.length - i; j++){
            if(array[j] > array[j + 1]){
                //swap
                array = swapValues(j, j + 1, array);
                moves.push([j, j + 1, true]);
            }
            else{
                moves.push([j, j + 1, false]);
            }
        }
    }
    return moves;
}

//selection sort algortihm
function selectionSort(array){
    //arr to store all the moves
    let moves = [];
    array = array.slice(0);//makes copy of array

    for(let i = 0; i < array.length; i++){
        let minIndex = i;
        for(let j = minIndex + 1; j < array.length; j++){
            if(array[j] < array[minIndex]){
                minIndex = j;
            }
            moves.push([i, j, false]);
            
        }
        swapValues(i, minIndex, array);        
        moves.push([i, minIndex, true]);

    }   
    return moves;
}


function insertionSort(array){
    //arr to store all the moves
    let moves = [];
    array = array.slice(0);//makes copy of array

    for(let i = 1; i < array.length; i++){
        for(let j = i; j > 0; j--){
            if(array[j] < array[j - 1]){
                //swap
                swapValues(j, j - 1, array);
                moves.push([j, j - 1, true]);                
            }
            else{
                moves.push([j, j - 1, false]);
            }

        }
    }
    return moves;
}

//swaps val
function swapValues(i, j, array){
    
    let temp;
    //swap numbers
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    //swap keyLinks
    temp = keyLinks[i];
    keyLinks[i] = keyLinks[j];
    keyLinks[j] = temp;

    return array;
}

//VIEW

//colors for the bars
const unsortedColor = "green";
const sortedColor = "rgb(193, 30, 193)";
const scanColor = "red";
const swapColor = "aqua";


//redners array to be displayed
function renderArray(){

    //first clear the container
    $("#main-container").empty();

    const size = numbers.length;

    //loops through all numbers in array and display's it in the container
    numbers.forEach((num, index) =>{
        //TODO
        const markup = `
            <div class="bar" id="${index}">${size < 25 ? num : ''}</div>
        `;

        //add bar to container
        const bar = $(markup);
        $("#main-container").append(bar);
        
        //bar dimentions
        setBarDimentions(bar, num, size);

    });
}
//sets bar dimentions based on the size of the array
function setBarDimentions(bar, num, size) {
    const barHeight = num * 4;
    const barWidth = Math.floor(800 / size);

    bar.css({
        width: "" + barWidth + "px",
        height: "" + barHeight + "px",
        marginRight: "" + (size < 70 ? "5px ": "0px"), 
    });
    bar.parent().css({
        justifyContent: "" + (size < 70 ? "center": "space-between")
    });
}

//sets a different color in bars that are in their final position (sorted)
function renderFinalColor(bars){
    keyLinks.forEach((keyLink, i) => {
        if(bars[i].id === ''+ keyLink){
            renderBarStyle([bars[i]], sortedColor);
        }

    });
}

//converts the index swap values of the permanent indexes to actual indexes of the bars in the DOM
function keyLinkToIndex(move, bars){
    return new Promise((resolve) => {

        let barIndex;
        let InsertBehindIndex;

        for(let i = 0; i < bars.length; i++){
            if(bars[i].id == move[0]){//look
                barIndex = i;
            }
            if(bars[i].id == move[1]){
                InsertBehindIndex = i;
            }
        }
        move[0] = barIndex;
        move[1] = InsertBehindIndex;
        resolve(move);

            
    });
}

/*NOTE: the moves array stores all the scans and swaps done on the 
numbers array while sorting.
the third element in each of the moves is a bool that states if that move is a swap or a scan
true: swap, false: scan

The fourth element in each move is a bool that states if the move container the actual index 
or the permanent keyLink index
true: permanent keyLink index, false: actual index
if moves[index][3] is true, the permanent keyLink index is converted to an actual index
*/
//handles rendering of sorting - recursive
async function renderSort(index, moves, bars, animationTime){

    renderFinalColor(bars);

    //base case
    if(index >= moves.length){
        //enable all inputs after sorting
        toggleInputs(false);
        return;
    }

    if(moves[index][3]){
        moves[index] = await keyLinkToIndex(moves[index], bars);
    }

    //recursive case

    //getting bars from index values out of moves
    let bar1 = bars[moves[index][0]];
    let bar2 = bars[moves[index][1]];
    //converting html elements to jquery objects that can be used for animations, etc
    bar1 = $(bar1);
    bar2 = $(bar2);

    //if true, swap
    if(moves[index][2]){
        //setting css properties before animation
        renderBarStyle([bar1, bar2], scanColor, "100", "0px");
        //using async/await and timeout functions to achieve delay
        setTimeout(async () => {
            renderBarStyle([bar1, bar2], swapColor, "100", "0px");

            setTimeout(async () => {
                //awaiting animation to be over
                if(moves[index][3]) await insertBar(bar1, bar2, animationTime);
                else await swapBars(bar1, bar2, animationTime);

                setTimeout(() =>{
                    renderBarStyle([bar1, bar2], unsortedColor, "0", "0px");
                    //recurse    
                    renderSort(index + 1, moves, bars, animationTime);

                }, animationTime);

            }, animationTime);

        }, animationTime);
        
        
    }
    //if false, scan
    else{
        renderBarStyle([bar1, bar2], scanColor, "0", "0px");
        setTimeout(() =>{
            renderBarStyle([bar1, bar2], unsortedColor, "0", "0px");
            //recurse
            renderSort(index + 1, moves, bars, animationTime);
        }, animationTime);
    }
}

//swaps two bars
function swapBars(bar1, bar2, animationTime){
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
            renderBarStyle([bar1], scanColor, "0", "0px");
        });

        bar2.animate({left: '+=' + (diff * bar2.outerWidth()) + 'px'}, animationTime, () =>{
            bar2.insertBefore(sibling);
            renderBarStyle([bar2], scanColor, "0", "0px"); 

            //promise resolved after this code before this runs
            resolve(true);
        });
    });
    
}

//insert bar1 before bar2
function insertBar(bar1, bar2, animationTime){
    return new Promise((resolve) => {
        bar1 = $(bar1);
        bar2 = $(bar2);
        //insert bar and animate it---->
        const diff = (bar1.index() - bar2.index());

        bar1.animate({left: '-=' + (diff * bar1.outerWidth()) + 'px'}, animationTime, () =>{
            bar1.insertBefore(bar2);
            renderBarStyle([bar1], scanColor, "0", "0px");

            resolve(true);
        });
    });
    

}

//renders bar styles(color, pos, etc)
function renderBarStyle(bars, bgColor, zInd, posLeft){
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
    const min = 10;
    const max = 150;
    populateArray(min, max, 10);
    renderArray();
    

    //when swap button is pressed
    $("#sort-button").off().on("click", function(){
        reset();

        //getting type of algorithm and sorting array
        let moves = [];
        if(algorithm !== null){
            if(algorithm === "bubble-sort-button")  moves = bubbleSort(numbers);
            else if(algorithm === "selection-sort-button")  moves = selectionSort(numbers);
            else if(algorithm === "insertion-sort-button")  moves = insertionSort(numbers);
            else if(algorithm === "merge-sort-button") moves = mergeSort(numbers);

        }
        else{
            alert("pick an algorithm");
            return;
        }

        //disable all other inputs
        toggleInputs(true);

        //get main container and its children - using vanialla js because jquery .children() is not working
        const container = document.getElementById('main-container');
        const children = container.children;

        //animation time
        const arrSize = numbers.length;

        //if arr size is high, animationtime is low
        const animationTime = arrSize > 40 ? 1 : Math.floor(1500 / arrSize);
        // const animationTime = 10;

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

//disables and enables inputs
function toggleInputs(disabled){
    //array on inputs
    const inputs = [$("#generate-arr-button"), $("#sort-button"), $("#array-size-input"), $("div.alg-select-button")];
    
    inputs.forEach(input => {
        input.attr("disabled", disabled)
            //diables hover an active css effects
            .css("pointer-events", disabled ? "none" : "all");
    });

}
//resets the page for new sort
function reset(){
    //resets keylinks
    keyLinks = [];
    for(let i = 0; i < numbers.length; i++){
        keyLinks.push(i);
    }

    renderArray();

}
