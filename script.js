const dimensions = { height: 400, width: 400, radius: 150 };
const center = { x: dimensions.width / 2, y: dimensions.height / 2 };

const initialData = [
  { name: 'bills', cost: 10 },
  { name: 'food', cost: 20 },
  { name: 'car', cost: 30 },
  { name: 'rent', cost: 40 },
];

// return new array based on the initialData array, with the percentage, initialValue, and previous element value properties added
const tempDragArray = initialData.map((element, idx, arr) => {
  if (idx === 0) {
    return {
      id: element.name,
      percentage: element.cost,
      initialValue: element.cost,
      previousElementValue: arr[arr.length - 1].cost,
      percentagePoint: 0,
    };
  } else {
    return {
      id: element.name,
      percentage: element.cost,
      initialValue: element.cost,
      previousElementValue: arr[idx - 1].cost,
      // calculate the percentagePoint by adding on each iteration all the previous costs
      percentagePoint: arr
        .slice(0, idx)
        .reduce((acc, curr) => acc + curr.cost, 0),
    };
  }
});
console.log('tempDragArray', tempDragArray);

// return new array based on the tempDragArray array, with the from and to properties added
const draggableElements = tempDragArray.map((element, idx, arr) => {
  if (idx === 0) {
    return {
      ...element,
      from: arr[arr.length - 1].percentagePoint,
      to: arr[idx + 1].percentagePoint,
    };
  } else if (idx === arr.length - 1) {
    return {
      ...element,
      from: arr[idx - 1].percentagePoint,
      to: arr[0].percentagePoint,
    };
  } else {
    return {
      ...element,
      from: arr[idx - 1].percentagePoint,
      to: arr[idx + 1].percentagePoint,
    };
  }
});
console.log('draggableElements', draggableElements);
