;(function($) {
"use strict";

/*!
 * jQuery Grid Plugin
 * http://github.com/jeremymarc/jquery.grid.js
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.3.2 or later
 */
var ver = '0.2';

var imagesSources = [],
    options
;

$.fn.grid = function(opt) {
    var defaults = {
        source: [],
        smallImageWidth: 140,
        largeImageWidth: 290, 
        imageHeight: 120,
        spacing: [10, 10],
        grid: [[0,0,1,0,0], [0,1,1,0], [0,0,1,0,0]],
        hideInitialImages: false,
        initialImageOrder: [],
        swap: {
            enabled: true,
            historyPosition: 1,
            minPerChange: 1,
            maxPerChange: 1,
            speed: 1000,
            fuzz: 0,
            overlap: 0
        }
    };
    options = $.extend({}, defaults, opt); 

    return this.each(function() {
        options = options || {};
        var $el = $(this);

        preloadImages(imagesSources = options.source);
        $el.html(buildGrid());

        if (options.swap.enabled) {
            setTimeout(function() {
                swapWrapper($el);
            }, options.swap.speed - Math.round(Math.random() * options.swap.fuzz));
        }
    });
}

var _randomImagesIndexes,
    _source_index = 0
;
function getRandomSourceIndex() {
    var i, n, firstCall;

    firstCall = ("undefined" == typeof(_randomImagesIndexes));
    if (firstCall) {
        _randomImagesIndexes = new Array();
    }

    if (_randomImagesIndexes.length == 0 || 
        _source_index >= _randomImagesIndexes.length) {
        _randomImagesIndexes = new Array();
        for (i = 0; i < imagesSources.length; i++) {
            n = Math.floor(Math.random()*imagesSources.length);
            if( jQuery.inArray(n, _randomImagesIndexes) > 0 ) --i;
            else _randomImagesIndexes.push(n);
        }

        _source_index = 0;
    }

    if (firstCall && options.initialImageOrder.length > 0) {
        var diff = new Array();
        jQuery.grep(_randomImagesIndexes, function(el) {
            if ($.inArray(el, options.initialImageOrder) == -1) diff.push(el);
        });

        _randomImagesIndexes = options.initialImageOrder.concat(diff);
    }

    return _randomImagesIndexes[_source_index++];
} 

//ensure uniqueness
var _displayedSourceIndexes = new Array();
function isSourceDisplayed(index) {
    return (jQuery.inArray(index, _displayedSourceIndexes) > -1);
}

function addDisplayedSourceIndex(index) {
    _displayedSourceIndexes.push(index);
}
function removeDisplayedSourceIndex(el) {
    var elementIndex = $.inArray(el, _displayedSourceIndexes);
    _displayedSourceIndexes.splice(elementIndex, 1);
}

var _current_index;
function getCurrentSourceIndex() {
    return _current_index;
}

function getNextRandomSource() {
    var randomIndex = getRandomSourceIndex();
    if (isSourceDisplayed(randomIndex)) {
        return getNextRandomSource(); 
    }

    _current_index = randomIndex;
    addDisplayedSourceIndex(randomIndex);
    return imagesSources[randomIndex];
}

/**
 * Get new random Image element which is not already displayed in the grid
 *
 * @return Image
 */
function getNextRandomImage(isLarge, animate) {
    var app = getNextRandomSource();
    var img = document.createElement('img');
    img.src = app[0];
    $(img)
        .attr('data-id', getCurrentSourceIndex())
        .width(options.smallImageWidth + 'px')
        .height(options.imageHeight + 'px')
    ;

    if (isLarge) {
        $(img)
            .width(options.largeImageWidth + 'px')
            .attr('src', app[1])
        ;
    }

    if (animate) {
        img.onload = function(e) {
            var that = this;
            setTimeout(function() {
                $(that).addClass('active');
            }, 25 + (Math.round(Math.random() * options.swap.fuzz)));
        }
    } else {
        $(img).addClass('active');
    }

    return img;
}


/**
 * Build initial grid element
 * 
 * @return grid element
 */
function buildGrid() {
    var top = 0,
        wrapper = document.createElement('div')
    ;

    $(wrapper).addClass('grid-container');

    for (var r = 0; r < options.grid.length; r++) {
        var row = options.grid[r],
            left = 0,
            col,
            width,
            isLarge,
            img
        ;

        for (col = 0; col < row.length; col++) {
            width = options.smallImageWidth;
            isLarge = false;

            if (1 == row[col]) {
                width = options.largeImageWidth;
                isLarge = true;
            }

            var container = document.createElement('div');
            $(container)
                .addClass('grid-img-container')
                .css({
                    'width': width + 'px',
                    'height': options.height + 'px',
                    'position': 'absolute',
                    'top': top + 'px',
                    'left': left + 'px'
                })
            ;
            wrapper.appendChild(container);

            img = getNextRandomImage(isLarge, false);

            if (options.hideInitialImages) {
                $(img).css('display', 'none');
            }
            container.appendChild(img);

            left += width + options.spacing[0];
        }

        top += options.spacing[1] + options.imageHeight;
    }

    return wrapper;
}

/**
 * Preload all images
 */
function preloadImages(elements) {
    var i, img, img2;
    for (i = 0; i < elements.length; i++) {
        img = new Image();
        img.src = elements[i][0];
        img2 = new Image();
        img2.src = elements[i][1];
    }
}

function swapWrapper($el) {
    var swapCount = options.swap.minPerChange + Math.round(Math.random() * (options.swap.maxPerChange - options.swap.minPerChange)),
        baseDelay = 0,
        i
    ;

    for (i = 0; i < swapCount; i++) {
        swapRandomImage($el, baseDelay - Math.round(Math.random() * options.swap.fuzz));
        baseDelay += options.swap.overlap;
    }

    setTimeout(function() {
        swapWrapper($el);
    }, baseDelay + options.swap.speed - Math.round(Math.random() * options.swap.fuzz));
}

var _swap_random = new Array();

/**
 * Keep history of historyCount swapped element positions to not pick same positions
 */
function getSwapRandom(max, historyCount) {
    var random;
    if ($.inArray(random = Math.round(Math.random() * max), _swap_random) > -1) {
        return getSwapRandom(max, historyCount);
    }

    _swap_random.push(random);
    if (_swap_random.length > historyCount) {
        _swap_random.shift();
    }

    return random;
}

/**
 * Swap a random image displayed on the grid by a new one (not displayed)
 *
 */
function swapRandomImage($el, delay) {
    var childs = $el.find('.grid-img-container'),
        isLarge = false,
        random,
        swapElement,
        app,
        img
    ;

    random = getSwapRandom(childs.length-1, options.swap.historyPosition);
    swapElement = childs.get(random);
    isLarge = ($(swapElement).width() == options.largeImageWidth);
    img = getNextRandomImage(isLarge, true);

    var oldImage = $(swapElement).find('img').get(0);
    if ($(oldImage).hasClass('removed')) {
        return;
    }
    $(oldImage).addClass('removed');

    removeDisplayedSourceIndex($(oldImage).data('id'));
    $(swapElement).append(img);

    (function(img) {
        setTimeout(function() {
            $(img).remove();
        }, 2000);
    })(oldImage);
}
})(jQuery);
