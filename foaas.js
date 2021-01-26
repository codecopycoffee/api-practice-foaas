const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'container');

// Dynamically build the form
const form = document.createElement('form');
form.setAttribute('id', 'form');
var select = document.createElement("select");
select.setAttribute('id', 'select');
const submit = document.createElement('input');
submit.setAttribute('type', 'submit');
submit.setAttribute('value', 'Like this');
submit.setAttribute('onclick', 'likeThis()');
submit.setAttribute('class', 'btn');

app.appendChild(container);
container.appendChild(form);
form.appendChild(select);
form.appendChild(submit);

// Create the request to get the methods of fucking off
var request = new XMLHttpRequest()
request.open('GET', 'https://foaas.com/operations', true)

request.onload = function () {
  // Access the JSON data
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    data.forEach((way) => {
			// Creates an html option element for every way that it is possible to fuck off
      const option = document.createElement('option');
      option.textContent = way.name;

			select.appendChild(option);
    })
  } else {
    const errorMessage = document.createElement('marquee');
    errorMessage.textContent = `Gah, it's not working!`;
    app.appendChild(errorMessage);
  }
}

request.send()

// Function that runs when user submits the form

function likeThis() {
	form.addEventListener("submit", function(event){
		event.preventDefault();
	})

	// Save the user's selection in the variable waySelected
	var waySelected = document.getElementById('select').value;

	// Check if text was entered and alert error if it wasn't
	if ( waySelected == "" || waySelected == null) {
		alert("Enter some text you fucking fucker");
	}

	// Grab the data so you can check if the way selected accepts parameters and display the correct options if so
	var request = new XMLHttpRequest();
	request.open('GET', 'https://foaas.com/operations', true);
	request.onload = function () {
	  // Access the JSON data again
	  var data = JSON.parse(this.response);
	  if (request.status >= 200 && request.status < 400) {
			console.log(data); // for easy reference
			// Check if params are available for the way selected, and display a form to accept them if so
			data.forEach((possibleWay) => {
				if ((possibleWay.name == waySelected) && ("fields" in possibleWay)) {
					// Create an array of the fields and save the url param associated with the user's selection
					var fieldsArr = possibleWay.fields;
					var rawUrl = possibleWay.url;
					var arr = rawUrl.split("");
					var newarr = [];

					for (i=1; i<arr.length; i++) {
						if (!newarr.includes("/")) {
							newarr.push(arr[i]);
						}
					}
					var url = newarr.join("");
					document.getElementById("urlHolder").textContent = url;

					// Display the form to take in values for the params
					const newHeading = document.createElement('h4');
					newHeading.textContent = 'Add some flair to the fucking off:';
					container.appendChild(newHeading);
					const subForm = document.createElement('form');
					subForm.setAttribute('id', 'subForm');
					container.appendChild(subForm);

					fieldsArr.forEach((field) => {
						var label = document.createElement('label');
						label.textContent = field.name;
						var input = document.createElement('input');
						input.setAttribute('type', 'text');
						input.setAttribute('class', 'subFormField');
						input.setAttribute('id', field.name);
						subForm.appendChild(label);
						subForm.appendChild(input);
					});

					const subFormSubmit = document.createElement('input');
					subFormSubmit.setAttribute('type', 'submit');
					subFormSubmit.setAttribute('value', 'Tell the fucker');
					subFormSubmit.setAttribute('onclick', 'tellEm()');
					subFormSubmit.setAttribute('class', 'btn');
					subForm.appendChild(subFormSubmit);

					subForm.addEventListener("submit", function(event){
						event.preventDefault();
					});

					// Do this API call if there are no params accepted (just the API call and display the result, no additional input or buttons or functions needed)
				} else if (possibleWay.name == waySelected && !"fields" in possibleWay) {
					// Still save the url of the selection
					var rawUrl = possibleWay.url;
					var arr = rawUrl.split("");
					var newarr = [];
					for (i=1; i<arr.length; i++) {
						if (!newarr.includes("/")) {
							newarr.push(arr[i]);
						}
					}
					var url = newarr.join("");
				}
			})
	  } else {
	    const errorMessage = document.createElement('marquee');
	    errorMessage.textContent = `The first API GET request is not working!`;
	    app.appendChild(errorMessage);
	  }
	}

	request.send()
}

function tellEm() {
	var subFormFields = document.getElementsByClassName('subFormField');
	var subFormValuesArr = [];
	// Create an array of the values of the subform
	for (i=0; i<subFormFields.length; i++) {
		subFormValuesArr.push(subFormFields[i].value + "/");
	}
	var params = subFormValuesArr.join("");
	var url = document.getElementById("urlHolder").innerHTML;

	var request = new XMLHttpRequest();
	request.open('GET', 'https://foaas.com/' + url + params, true);

	request.onload = function () {
	  // The response is html as a string, so output the data into a hidden div, target elements within it to capture the content, and then display only that content using JS
	  var data = this.response;
	  if (request.status >= 200 && request.status < 400) {
			document.getElementById('responseHolder').innerHTML = data;
			document.getElementsByTagName('h1')[0].setAttribute('id', 'responseText');

			const resetBtn = document.createElement('button');
			resetBtn.setAttribute('onclick', 'window.location.reload()');
			resetBtn.textContent = 'Tell someone else to fuck off';
			resetBtn.setAttribute('id', 'resetBtn');
			document.getElementsByClassName('hero-unit')[0].appendChild(resetBtn);
	  } else {
	    const errorMessage = document.createElement('marquee');
	    errorMessage.textContent = `The second API GET request is not working!`;
	    app.appendChild(errorMessage);
	  }
	}

	request.send()
}
