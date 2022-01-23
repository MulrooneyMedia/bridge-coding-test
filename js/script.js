// JavaScript for Bridge Test by Mark Mulrooney

document.addEventListener('DOMContentLoaded', function() {

	// Collect all the elements with class 'costParcel' but not if it also has 'invisible' or 'total'.
	const costParcels = document.querySelectorAll('.costParcel:not(.invisible):not(.total)');

	// Sum up all the prices and put it into the place for the total  
	let totalCostCalculator = function(){

		const totalCost = document.querySelector('#totalCost');
		let totalPrice = 0;
		let counter = 0;

		costParcels.forEach(element => {
			// exclude items that are not checked
			let checkBoxValue = element.querySelector('input').checked;
			if (checkBoxValue === true) {
				let thisPrice = parseFloat(element.querySelector('.price').innerHTML);
				counter += thisPrice;
				totalPrice = counter.toFixed(2);
			}
		});

		totalCost.innerHTML = totalPrice;
	};
	totalCostCalculator();

	// Check if a checkbox has been clicked on, if so, recalculate the total
	let checkboxChecker = function() {
		costParcels.forEach(element => {
			let checkBox = element.querySelector('input');
			checkBox.addEventListener('click', function(e) {
				totalCostCalculator();
			});
		});
	}
	checkboxChecker();

	let priceGetter = function(relevantID) {
		let checkbox = document.querySelector(relevantID);
		let parent = checkbox.parentElement;
		return (parseFloat(parent.querySelector('.price').innerHTML));
	}

	let questionAnswerGetter = function(relevantID) {
		let question = document.querySelector(relevantID);
		return (parseFloat(question.value));
	}

	// for formating large numbers with comma separators and two decimal places
	let numberWithCommas = function (x) {
		return x.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}

	// Sum up all the prices in the table and put it into the place for the total  
	let totalTableCostCalculator = function(){

		//  Supplier & product: (Identify requirements + Request a quotation) * question_2 
		const sp = document.querySelector('#sp');
		sp.innerHTML = ((priceGetter("#identifyRequirements") + priceGetter("#requestQuotation")) * questionAnswerGetter("#uniquePOs")).toFixed(2);
		
		// Quotation to order process: (Find products + Raise an order + Authorise sale + Pay provider) * question_2 
		const qop = document.querySelector('#qop');
		qop.innerHTML = ((priceGetter("#findProducts") + priceGetter("#raiseOrder") + priceGetter("#authoriseSale")+ priceGetter("#payProvider")) * questionAnswerGetter("#uniquePOs")).toFixed(2);

		// Expediting & receiving orders: Deliver product* question_1 
		const ero = document.querySelector('#ero');
		ero.innerHTML = ((priceGetter("#deliverProduct")) * questionAnswerGetter("#annualSpend")).toFixed(2);
		
		// Processing invoices: Invoice check * question_2
		const pi = document.querySelector('#pi');
		pi.innerHTML = ((priceGetter("#invoiceCheck")) * questionAnswerGetter("#uniquePOs")).toFixed(2);
		
		// Paying suppliers: Place order * question_3 
		const ps = document.querySelector('#ps');
		ps.innerHTML = ((priceGetter("#placeOrder")) * questionAnswerGetter("#suppliers")).toFixed(2);
		
		// Total Process costs: Supplier & product + Quotation to order process + Expediting & receiving orders + Processing invoices + Paying suppliers

		const rowPrices = document.querySelectorAll('.screen5Results td:not(#grandTotal)');
		const totalCostTarget = document.querySelector('#grandTotal');
		let totalPrice = 0;

		rowPrices.forEach(element => {
			let thisPrice = parseFloat(element.innerHTML); // get number from string
			totalPrice += thisPrice; // add up numbers
			element.innerHTML = numberWithCommas(thisPrice);  // format number into string with comma separators and two decimal places
		});
		// plot total as string with comma separators and two decimal places
		totalPrice = numberWithCommas(totalPrice);
		totalCostTarget.innerHTML = totalPrice;
	};


	let fadeUpButton = function(){
		setTimeout(function(){
			let restartButton = document.querySelector('.restart');
			restartButton.classList.remove('hidden');
			restartButton.classList.add('fadeUp');
		}, 1000);
	}


	//  ROUTINE FOR MULTIPLE BUTTON CLICKS - PICKs UP DESTINATION from TITLE attribute
	const continueButtons = document.querySelectorAll('button');
	continueButtons.forEach(element => {
		element.addEventListener('click', function(e) {
			e.preventDefault();
			let switchScreen = element.getAttribute('title');
			changeScreen(switchScreen);
		});
	})

	// take clicks from anchor shiftButtons to shift the screen in to view
	const shiftButtons = document.querySelectorAll('.shiftButton');
	shiftButtons.forEach(element => {
		element.addEventListener('click', function(e) {
			e.preventDefault();
			let switchScreen = element.getAttribute('href');
			changeScreen(switchScreen);
		});
	})


	// METHOD TO REMOVE THE ANIMATION IN USE FROM THE LIST OF ALL POSSIBLE ANIMATIONS
	let arrayOfAnimations = ['comeInToView','comeInToViewFromLeft','pushOff','pushOffRight'];
	let swapAnimationClasses = function(target,anim) {
		target.classList.add(anim);

		setTimeout(function(){
			arrayOfAnimations.forEach(element => {
				if (anim != element) {target.classList.remove(element);}
			});
		}, 500);
	}

	// Moves the screens to the left or right
	let swiper = function(targetScreen1, targetScreen2, direction = 'right') {
		let screen1 = document.querySelector(targetScreen1);
		let screen2 = document.querySelector(targetScreen2);
		if (!screen1 || !screen2) {
			console.log(`Error - Fault with either ${targetScreen1} = ${screen1} or ${targetScreen2} = ${screen2}.`);
			return false;
		}

		if (direction === 'left') {
			swapAnimationClasses(screen1,'pushOffRight');
			swapAnimationClasses(screen2,'comeInToViewFromLeft');
		}
		else {
			swapAnimationClasses(screen1,'pushOff');
			swapAnimationClasses(screen2,'comeInToView');
		}
	}

	// Decide which set of screens are to be animated, and with which direction
	let changeScreen = function(switchScreen){
		if (switchScreen === "#1L") {
			swiper('.screen2Q1', '.screen1Costs', 'left');
		}
		else if (switchScreen === "#2") {
			swiper('.screen1Costs', '.screen2Q1');
		}
		else if (switchScreen === "#2L") {
			swiper('.screen3Q2', '.screen2Q1', 'left');
		}
		else if (switchScreen === "#3") {
			swiper('.screen2Q1', '.screen3Q2');
		}
		else if (switchScreen === "#3L") {
			swiper('.screen4Q3', '.screen3Q2', 'left');
		}
		else if (switchScreen === "#4") {
			swiper('.screen3Q2', '.screen4Q3');
		}
		else if (switchScreen === "#4L") {
			swiper('.screen5Results', '.screen4Q3', 'left');
		}
		else if (switchScreen === "#5") {
			swiper('.screen4Q3', '.screen5Results');
			totalTableCostCalculator();
		}
		else if (switchScreen === "#6") {
			swiper('.screen5Results', '.screen6Thanks');
			fadeUpButton();
		}
		else if (switchScreen === "#1Restart") {
			swiper('.screen6Thanks', '.screen1Costs');
		}
	}
});