var PageTransitions = function(bgArray, startPage) {

	var fnHash = {enter:[], leave:[]};
	var $main = $('#pt-main'),
		curBg = 0;
		$pages = $main.children('.pt-page'),
		$leftpane = $('.camouflage'),
		$camouflage_bg = $('.camouflage-bg'),
		priAnim = 0,
		secAnim = 0,
		pagesCount = $pages.length,
		current = (typeof startPage !== 'undefined') ? startPage : 0,
		previous = current,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		colorClass = "color-"+bgArray[0].split("-")[1],
		bgClass = bgArray[0],
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed('animation') ],
		// support css animations
		support = Modernizr.cssanimations;

	function init() {
		$pages.each( function() {
			var $page = $(this);
			$page.data('originalClassList', $page.attr('class'));
		});
		$pages.eq(current).addClass('pt-page-current '+bgArray[0]);
		$leftpane.toggleClass(colorClass);
	}

	function changebg(bg) {
		var $currPage = $pages.eq(current);
		$leftpane.css('color', 'auto');
		$leftpane.toggleClass(colorClass);
		colorClass = "color-"+bg.split("-")[1];
		$leftpane.addClass(colorClass);
		$currPage.toggleClass(bgClass);
		$camouflage_bg.toggleClass(bgClass);
		$currPage.addClass(bg);
		$camouflage_bg.toggleClass(bg);
		bgClass = bg;
	}

	function changeleftpane(color) {
		$leftpane.css('color', 'auto');
		if (color) {
			$leftpane.css('color', color);
		}
		else {
			$leftpane.toggleClass(colorClass);
			colorClass = "color-"+bgArray[curBg].split("-")[1];
			$leftpane.addClass(colorClass);
		}
	}
	function clickButton(index, sec, newdiv, oldhtml) {
		if( isAnimating ) {
			return current;
		}
		if(current == index) {
			return current;
		}
		isAnimating = true;
		var $currPage = $pages.eq(current);
		/*
		if( current < pagesCount - 1 ) {
			//++current;
		} else {
			current = 0;
		}
		*/
		previous = current;
		current = index;

		var $nextPage = $pages.eq(current).addClass('pt-page-current');
		var ret = getNextAnimation(sec);
		if (newdiv !== null) {
			$nextPage.children('.screen-container').empty();
			$nextPage.children('.screen-container').append(newdiv);
		}
		if (oldhtml !== null) {
			$currPage.children('.screen-container').html(oldhtml);
		}

		$currPage.addClass(ret[0]).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if(endNextPage) {
				onEndAnimation( $currPage, $nextPage );
			}
		});
		$camouflage_bg.removeClass(bgClass);
		curBg = (curBg + 1)%bgArray.length;
		bgClass = bgArray[curBg];
		changeleftpane(null);
		$nextPage.addClass(bgArray[curBg]);
		$camouflage_bg.toggleClass(bgClass);
		$nextPage.addClass(ret[1]).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if(endCurrPage) {
				onEndAnimation($currPage, $nextPage);
			}
		});

		if(!support) {
			onEndAnimation($currPage, $nextPage);
		}

		return current;
	}

	function register (direction, mode, index, fn) {
		fnHash[mode][index] = fn;
		fnHash[mode][index] = fn;
	}

	function onEndAnimation($outpage, $inpage) {
		endCurrPage = false;
		endNextPage = false;
		resetPage($outpage, $inpage);
		isAnimating = false;
		if (fnHash.leave[previous]) {
			fnHash.leave[previous]("up");
		}
		if (fnHash.enter[current]) {
			fnHash.enter[current]("up");
		}
	}

	function resetPage($outpage, $inpage) {
		$outpage.attr('class', $outpage.data('originalClassList'));
		$inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current' );
		$inpage.addClass(bgArray[curBg]);
	}

	function getNextAnimation (sec) {
		var sec_arr = [
			[
				['pt-page-moveToLeft', 'pt-page-moveFromRight'],
				['pt-page-moveToRight', 'pt-page-moveFromLeft'],
				['pt-page-moveToTop', 'pt-page-moveFromBottom'],
				['pt-page-moveToBottom', 'pt-page-moveFromTop']
			],
			[
				['pt-page-fade', 'pt-page-moveFromRight pt-page-ontop'],
				['pt-page-fade', 'pt-page-moveFromLeft pt-page-ontop'],
				['pt-page-fade', 'pt-page-moveFromBottom pt-page-ontop'],
				['pt-page-fade', 'pt-page-moveFromTop pt-page-ontop']
			],
			[
				['pt-page-moveToLeftFade', 'pt-page-moveFromRightFade'],
				['pt-page-moveToRightFade', 'pt-page-moveFromLeftFade'],
				['pt-page-moveToTopFade', 'pt-page-moveFromBottomFade'],
				['pt-page-moveToBottomFade', 'pt-page-moveFromTopFade']
			],
			[
				['pt-page-moveToLeftEasing pt-page-ontop', 'pt-page-moveFromRight'],
				['pt-page-moveToRightEasing pt-page-ontop', 'pt-page-moveFromLeft'],
				['pt-page-moveToTopEasing pt-page-ontop', 'pt-page-moveFromBottom'],
				['pt-page-moveToBottomEasing pt-page-ontop', 'pt-page-moveFromTop']
			],
			[
				['pt-page-scaleDown', 'pt-page-moveFromRight pt-page-ontop'],
				['pt-page-scaleDown', 'pt-page-moveFromLeft pt-page-ontop'],
				['pt-page-scaleDown', 'pt-page-moveFromBottom pt-page-ontop'],
				['pt-page-scaleDown', 'pt-page-moveFromTop pt-page-ontop']
			]
		];
		var arr = [
			[
				['pt-page-scaleDown', 'pt-page-scaleUpDown pt-page-delay300'],
				['pt-page-scaleDownUp', 'pt-page-scaleUp pt-page-delay300'],
				['pt-page-scaleDownCenter', 'pt-page-scaleUpCenter pt-page-delay400']
			],
			[
				['pt-page-moveToLeft pt-page-ontop', 'pt-page-scaleUp'],
				['pt-page-moveToRight pt-page-ontop', 'pt-page-scaleUp'],
				['pt-page-moveToTop pt-page-ontop', 'pt-page-scaleUp'],
				['pt-page-moveToBottom pt-page-ontop', 'pt-page-scaleUp']
			],
			[
				['pt-page-rotateRightSideFirst', 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop'],
				['pt-page-rotateLeftSideFirst', 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop'],
				['pt-page-rotateTopSideFirst', 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop'],
				['pt-page-rotateBottomSideFirst', 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop']
			],
			[
				['pt-page-flipOutRight', 'pt-page-flipInLeft pt-page-delay500'],
				['pt-page-flipOutLeft', 'pt-page-flipInRight pt-page-delay500'],
				['pt-page-flipOutTop', 'pt-page-flipInBottom pt-page-delay500'],
				['pt-page-flipOutBottom', 'pt-page-flipInTop pt-page-delay500']
			],
			[
				['pt-page-rotateFall pt-page-ontop', 'pt-page-scaleUp']
			],
			[
				['pt-page-rotateOutNewspaper', 'pt-page-rotateInNewspaper pt-page-delay500']
			],
			[
				['pt-page-rotatePushLeft', 'pt-page-moveFromRight'],
				['pt-page-rotatePushRight', 'pt-page-moveFromLeft'],
				['pt-page-rotatePushTop', 'pt-page-moveFromBottom'],
				['pt-page-rotatePushBottom', 'pt-page-moveFromTop']
			],
			[
				['pt-page-rotatePushLeft', 'pt-page-rotatePullRight pt-page-delay180'],
				['pt-page-rotatePushRight', 'pt-page-rotatePullLeft pt-page-delay180'],
				['pt-page-rotatePushTop', 'pt-page-rotatePullBottom pt-page-delay180'],
				['pt-page-rotatePushBottom', 'pt-page-rotatePullTop pt-page-delay180']
			],
			[
				['pt-page-rotateFoldLeft', 'pt-page-moveFromRightFade'],
				['pt-page-rotateFoldRight', 'pt-page-moveFromLeftFade'],
				['pt-page-rotateFoldTop', 'pt-page-moveFromBottomFade'],
				['pt-page-rotateFoldBottom', 'pt-page-moveFromTopFade']
			],
			[
				['pt-page-moveToRightFade', 'pt-page-rotateUnfoldLeft'],
				['pt-page-moveToLeftFade', 'pt-page-rotateUnfoldRight'],
				['pt-page-moveToBottomFade', 'pt-page-rotateUnfoldTop'],
				['pt-page-moveToTopFade', 'pt-page-rotateUnfoldBottom']
			],
			[
				['pt-page-rotateRoomLeftOut pt-page-ontop', 'pt-page-rotateRoomLeftIn'],
				['pt-page-rotateRoomRightOut pt-page-ontop', 'pt-page-rotateRoomRightIn'],
				['pt-page-rotateRoomTopOut pt-page-ontop', 'pt-page-rotateRoomTopIn'],
				['pt-page-rotateRoomBottomOut pt-page-ontop', 'pt-page-rotateRoomBottomIn']
			],
			[
				['pt-page-rotateCubeLeftOut pt-page-ontop', 'pt-page-rotateCubeLeftIn'],
				['pt-page-rotateCubeRightOut pt-page-ontop', 'pt-page-rotateCubeRightIn'],
				['pt-page-rotateCubeTopOut pt-page-ontop', 'pt-page-rotateCubeTopIn'],
				['pt-page-rotateCubeBottomOut pt-page-ontop', 'pt-page-rotateCubeBottomIn']
			],
			[
				['pt-page-rotateCarouselLeftOut pt-page-ontop', 'pt-page-rotateCarouselLeftIn'],
				['pt-page-rotateCarouselRightOut pt-page-ontop', 'pt-page-rotateCarouselRightIn'],
				['pt-page-rotateCarouselTopOut pt-page-ontop', 'pt-page-rotateCarouselTopIn'],
				['pt-page-rotateCarouselBottomOut pt-page-ontop', 'pt-page-rotateCarouselBottomIn']
			],
			[
				['pt-page-rotateSidesOut', 'pt-page-rotateSidesIn pt-page-delay200'],
				['pt-page-rotateSlideOut', 'pt-page-rotateSlideIn']
			]
		];
		var ret = arr[priAnim][secAnim];
		priAnim = (priAnim + 1)%arr.length;
		if (sec === 1) {
			ret = sec_arr[1][0];
		} else if (sec === 2) {
			ret = sec_arr[1][1];
		}
		return ret;
	}
	init();
	return {init : init , click: clickButton, register:register, changeleftpane:changeleftpane, changebg:changebg};
};
