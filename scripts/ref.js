let nums = [];

for(let i = 0; i < 20; i++){
    const rand = Math.floor(Math.random() * 46) + 5;
    nums.push(rand);

    const bar = document.createElement('div');

    bar.id = i;
    bar.style.float = 'left';
    bar.style.textAlign = 'center';
    bar.style.border = '1px solid black';
    bar.style.backgroundColor = 'green';
    bar.style.width = '20px';
    bar.style.height = rand * 10 + 'px';

    const node = document.createTextNode(rand);
    bar.appendChild(node);

    const element = document.getElementById('main');
    element.appendChild(bar)
}
console.log(nums);


const btn = document.getElementById('sortBtn');
btn.addEventListener('click', () => {
    selectionSort(nums);
});


const swaps = [];
//sort the array
//selection sort algorithm
function selectionSort(arr){

    for(let i = 0; i < arr.length; i++){
        let minIndex = i;
        for(let j = minIndex + 1; j < arr.length; j++){
            if(arr[j] < arr[minIndex]){
                minIndex = j;
                
            }
        }
        //swapping nodes as well
        //using var because it can be re-declared
        let temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
        swaps.push([i, minIndex]);
    }
    let index = 0;
    const interval = setInterval(() => {
        swapNodes(swaps, index);
        index++;
        if(index >= swaps.length){
            clearInterval(interval);
        }
    }, 100);
    console.log(arr);
    
    return arr;
}

//function to swap 2 boxes

function swapNodes(swaps, index){
    const swap = swaps[index];

    const mainElement = document.getElementById('main');
    nodeA = mainElement.childNodes[swap[0]];
    nodeB = mainElement.childNodes[swap[1]];

    //finds sibling of nodeA so that nodeB can be inserted before it
    let siblingA;
    //if nodeA and nodeB are next to each other, the sibling is nodeA (as nodeB is inserted before siblingA)
    if(nodeA.nextSibling === nodeB){
        siblingA = nodeA;
    }
    else{
        siblingA = nodeA.nextSibling;
    }

    // Move `nodeA` to before the `nodeB`
    mainElement.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    mainElement.insertBefore(nodeB, siblingA);

}

function selectionSort2(arr){

    for(let i = 0; i < arr.length; i++){
        let minIndex = i;
        for(let j = minIndex + 1; j < arr.length; j++){
            if(arr[j] < arr[minIndex]){
                minIndex = j;  
            }
        }

        setTimeout(() => {
            //swapping nodes as well
            //using var because it can be re-declared
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
            swapNodesIndex(i, minIndex);
        }, 500 * i);

    }
    
    return arr;
}



function swapNodesIndex(i, j){

    const mainElement = document.getElementById('main');
    nodeA = mainElement.childNodes[i];
    nodeB = mainElement.childNodes[j];

    //finds sibling of nodeA so that nodeB can be inserted before it
    let siblingA;
    //if nodeA and nodeB are next to each other, the sibling is nodeA (as nodeB is inserted before siblingA)
    if(nodeA.nextSibling === nodeB){
        siblingA = nodeA;
    }
    else{
        siblingA = nodeA.nextSibling;
    }

    // Move `nodeA` to before `nodeB`
    mainElement.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    mainElement.insertBefore(nodeB, siblingA);

}

const homeBtn = document.getElementById('homeBtn');
homeBtn.addEventListener('click', test1);

function test2(len){
    let i = 0;
    let j = 1;
    //document.getElementById('main').childNodes[index].style.backgroundColor = 'red';
    // document.getElementById('main').childNodes[j].style.backgroundColor = 'red';
    const interval = setInterval(() => {

        if(nums[i] > nums[j]){
            swapNodesIndex(i, j);
            let temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
        }
        i++;
        j++;
        if(j >= len){
            clearInterval(interval);
        }
        
    }, 50);


}

function test1(){
    let i = nums.length;
    const interval = setInterval(() => {
        test2(i);
        i--;
        if(i <= 0){
            clearInterval(interval);
        }
    }, i*50);

}
