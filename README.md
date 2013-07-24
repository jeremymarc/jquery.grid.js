# jQuery Grid Plugin

Grid is an easy-to-use plugin that provides many options to generate an  image grid from an array source.

Browser support: Chrome, Firefox, Opera, IE >= 7

![jQuery Grid](jquery.grid.png)

Example :
```
$('.el').grid({
    source: apps,
    smallImageWidth: 140,
    largeImageWidth: 290, 
    imageHeight: 117,
    spacing: [9, 10],
    grid: [[0,0,1,0,0], [0,1,1,0], [0,0,1,0,0]],
    hideInitialImages: false,
    initialImageOrder: [4, 6, 9, 3, 1, 2, 5, 7, 8],
    swap: {
        enabled: true,
        historyPosition: 1,
        minPerChange: 1,
        maxPerChange: 1,
        speed: 1000,
        fuzz: 500,
        overlap: 1200
    }
});
```

## Parameters
### Global

#### source
Array source for the grid. The current version support only 2 versions of each images.
```
var apps = [
    ['http://path/small', 'http://path/large'],
    ['http://path/small', 'http://path/large'],
    ['http://path/small', 'http://path/large']
];
```

Default value: []

#### smallImageWidth
Width of the small image (first one in the source array). Default value: 140.

#### largeImageWidth
Width of the small image (second one in the source array). Default value: 290.

#### imageHeight
Image height. Will be used for small and large images. Default value: 120.

#### spacing
Array of image spacing. First element is the horizontal space(x) and the second
element is the vertical space (y). Default value is [10, 10]

#### grid
Array used to generate the grid.
0 means "place here a small version" and 1 means "place here a large version".
Default value: [[0,0,1,0,0], [0,1,1,0], [0,0,1,0,0]]

#### hideInitialImages
Boolean to hide/show the initial image. Usefull to prevent flickering for 
initial load (and using a background image).
Default false

#### initialImageOrder
If specified, this array will be used as the initial image order. Usefull if 
we want to use a background image for initial load (with hideInitialImage: true)
Default []

<br>
### Swap
Parameters used to update image. When we are swapping a new image, a new class
"active" is added to the element so you can easily add a css transition.

#### swap.enabled
Boolean to activate/deactivate the image swap.
Default value: true

#### swap.historyPosition
Specify the number of previous swapped position in the grid, to prevent swapping
same element position. Default value is 1.
_Must not be greater than the number of grid elements._

#### swap.minPerChange
Specify the minimum images to change by swap. Default is 1.

#### swap.maxPerChange
Specify the minimum images to change by swap. Default is 1.

#### swap.speed
Specify the speed of the swapping. Default value is 1000 (1s).

#### swap.fuzz
Specify a value to randomize the swap interval. Default value is 0.

####swap.overlay
Used only when there is more than 1 element to swap. It will used a delay between all elements. Default value is 0.
