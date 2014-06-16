var navObj;
$(document).ready(function() {
	navObj = waypoint_init();
	//Page.init();
});

function Cover($scope) {
	$scope.position = 0;
	$scope.navClick = function (index) {
		navObj.move(index);
	};
}

function SkillSet($scope) {
	var boxObj = BoxGrid();
	$scope.skillSet = skillSet;
	$scope.currentSkill = $scope.skillSet[0];
	var background = "#996699";
	$scope.position = 0;
	$scope.current = null;
	$scope.sendMessage = function() {
	};
	$scope.skillClose = function () {
		$scope.currentSkill = null;
		boxObj.close($scope.current);
	};
	$scope.skillClick = function ($event, skill) {
		$scope.current = $($event.target);
		boxObj.open($scope.current, skill.bg, skill.invert);
		$scope.currentSkill = skill;
	};
}

function Projects($scope) {
	var bgArray = [
		"background-orange",
		"background-peterRiver",
		"background-metroRed",
		"background-metroCyan",
		"background-metroJade",
		"background-metroTeal",
		"background-metroPurple",
		"background-turquoise"
	];
	var ptObj = PageTransitions(bgArray);
	$scope.current = 0;
	$scope.position = 0;
	$scope.projectClick = function() {
		$scope.moveRight();
		$scope.nextPt("");
	};
	$scope.moveRight = function (callback) {
		$container = $(".projects");
		var opened = $container.data('opened');
		if (! opened) {
			$container.addClass("slideRight").data('opened', true);
		} else {
			$container.removeClass("slideRight").data('opened', false);
		}

	};
	$scope.nextPt = function (arg) {
		$scope.current = ptObj.click();
	};
}

function Contact($scope){
	$scope.index = 0;
	$scope.total = 5;
	setInterval(function() {
		$scope.index = ($scope.index + 1)%$scope.total;
		$scope.$apply()
	}, 3000);

	$scope.arr = [
		{name:"Facebook", class:"fa-facebook color-merald", href:"https://facebook.com/socceranoo"},
		{name:"Mail", class:"fa-envelope color-louds", href:"mailto:socceranoo@gmail.com"},
		{name:"Google Plus", class:"fa-google-plus color-etroCyan", href:"https://plus.google.com/u/0/105434114873208835365/"},
		{name:"Linked-in", class:"fa-linkedin color-unFlower", href:"https://www.linkedin.com/pub/manjunath-mageswaran/14/466/372/"},
		{name:"Twitter", class:"fa-twitter color-lizarin", href:"https://twitter.com/socceranoo"},
		{name:"Pinterest", class:"fa-pinterest color-etroNavy", href:"https://pinterest.com/socceranoo"}
	];

}

function waypoint_init () {
	var inprogress = false;
	var current = 0;
	/*
   */
	$(".full-height").waypoint(function(direction) {
			if (direction === 'down' && inprogress === false) {
				var index = $(".full-height").index(this);
				setActive(index);
			}
		},
		{ offset: '50%' , triggerOnce : false }
	);

	$(".full-height").waypoint(function(direction) {
			if (direction === 'up' && inprogress === false) {
				var index = $(".full-height").index(this);
				setActive(index);
			}
		},
		{ offset: '-50%' , triggerOnce : false }
	);

	$(".item-selector li").click(function () {
		move($(this).index());
	});

	function move(val) {
		if (! $(".full-height:eq("+val+")").length){
			return;
		}
		if (current === val ) {
			if ($('html body').scrollTop() == $(".full-height:eq("+val+")").offset().top)
				return;
		}
		var diff = Math.abs(val - current);
		var delay = diff * 500 + 500;
		//delay = (delay < 1000)?1000:delay;
		inprogress = true;
		$('html, body').animate({ scrollTop: $(".full-height:eq("+val+")").offset().top }, delay , function () {
			setActive(val);
		});
	}
	function setActive(val) {
		inprogress = false;
		$(".item-selector li:eq("+current+")").removeClass("active");
		$(".item-selector li:eq("+val+")").addClass("active");
		current = val;
	}

	return {move:move, active:setActive};
}
