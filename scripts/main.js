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

//removes all swaps with no change (same index)
const removeDuplicates = swaps =>{
    swaps = swaps.filter(swap =>{
        if(swap[0] === swap[1]){
            return false;
        }
        else{
            return true;
        }
    });
    return swaps;
} 

//selection sort algortihm
const selectionSort = () =>{
    //arr to store all the swaps
    let swaps = [];

    for(let i = 0; i < numbers.length; i++){
        let minIndex = i;
        for(let j = minIndex + 1; j < numbers.length; j++){
            if(numbers[j] < numbers[minIndex]){
                minIndex = j;
            }
        }
        //swapping nodes as well
        //using var because it can be re-declared
        const temp = numbers[i];
        numbers[i] = numbers[minIndex];
        numbers[minIndex] = temp;
        swaps.push([i, minIndex]);

    }   
    return swaps;
}


const bubbleSort = () =>{
    let swaps = [];
    let moves = [];

    for(let i = 0; i < numbers.length; i++){
        for(let j = 0; j < numbers.length - i; j++){
            moves.push([j, j + 1]);
            if(numbers[j] > numbers[j + 1]){
                //swap
                const temp = numbers[j + 1];
                numbers[j + 1] = numbers[j];
                numbers[j] = temp;
                swaps.push([j, j + 1]);

            }
        }
    }
    return [swaps, moves];
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

//swaps to bars in container
const swapBars1 = (bar1, bar2, animationTime) =>{

    //converting html elements to jquery objects
    bar1 = $(bar1);
    bar2 = $(bar2);

    //temproprary element (right sibling of bar1)
    const sibling = bar1.next().is(bar2) ? bar1 : bar1.next();

    //swap bars and animate them---->
    //setting css properties before animation

    bar1.css({
        zIndex: '100',
        backgroundColor: 'red'
    });
    bar2.css({
        zIndex: '100',
        backgroundColor: 'red'
    });

    const diff = (bar1.index() - bar2.index());
    //animation for swapping
    setTimeout(() =>{
        bar1.animate({left: '-=' + (diff * 22) + 'px'}, animationTime, () =>{
            bar1.insertBefore(bar2);
            bar1.css({
                left: '0',
                zIndex: '0',
                backgroundColor: 'green',
            });
        });
        bar2.animate({left: '+=' + (diff * 22) + 'px'}, animationTime, () =>{
            bar2.insertBefore(sibling);
            bar2.css({
                left: '0',
                zIndex: '0',
                backgroundColor: 'green',
            });
        });

        // bar1.insertBefore(bar2);
        // bar1.css({
        //             left: '0',
        //             zIndex: '0',
        //             backgroundColor: 'green',
        //         });
        // bar2.insertBefore(sibling);
        // bar2.css({
        //             left: '0',
        //             zIndex: '0',
        //             backgroundColor: 'green',
        // });


    }, animationTime);

}

//handles rendering of sorting - recursive
const renderSort = (index, swaps, bars, animationTime) =>{

    if(index >= swaps.length){
        return;
    }

    //getting bars from index values out of moves
    let bar1 = bars[swaps[index][0] + 1];
    let bar2 = bars[swaps[index][1] + 1];
    //converting html elements to jquery objects
    bar1 = $(bar1);
    bar2 = $(bar2);

    //setting css properties before animation
    renderBarStyle([bar1, bar2], "red", "100", "0px");

    //after a certain time other code is run
    //if(moves[index][0] === moves[index][0])
    setTimeout(() =>{
        //evauating promise - it waits for swapBars() to be executed before continuing
        swapBars(bar1, bar2, animationTime).then(
            (result) => {
                setTimeout(() =>{
                    renderBarStyle([bar1, bar2], "green", "0", "0px");
                    //recurse    
                    renderSort(index + 1, swaps, bars, animationTime, swapBars);
                }, animationTime);   
            }
        );

    }, animationTime);
    

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
    populateArray(1, 40, 50);
    renderArray();


    //when swap button is pressed
    $("#swap-button").off().on("click", function(){
        //get main container and its children - using vanialla js because jquery .children() is not working
        let container = document.getElementById('main-container');
        let children = container.childNodes;        
        
        //sort
        const [swaps, moves] = bubbleSort();
        //animation time
        const animationTime = 1;

        renderSort(0, swaps, children, animationTime);


        // //display swaps
        // let index = 0;
        // const interval = setInterval(() => {
        //     const c1 = children[swaps[index][0] + 1];
        //     const c2 = children[swaps[index][1] + 1];
        //     swapBars(c1, c2, animationTime);//render function
        //     index++;
        //     children = container.childNodes;//updating children everytime they are swapped

        //     if(index >= swaps.length){
        //         clearInterval(interval);
        //     }
        // }, animationTime * 5);


    });

});