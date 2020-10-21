function displaySportList(data) {
	console.log(data);
	sports_names = []
	data.sports.forEach(item => {
		$(".sports-list").append(`	<li>
										${item.name}
									</li>`);
	});
}

function onload(){
	//we need to set whay are the parameters to retrieve the data
	console.log("On Load");
	let url = "./sports/api/list-sports";
	let settings = {
		method : "GET",
		headers : {
			'Content-Type' : 'application/json'
		}
	};

	console.log("Before fetch");
	fetch(url, settings)
		.then(response => {
			//all the 200s are going to be "OK"
			console.log("First then");
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		})
		.then(responseJSON => {
			displaySportList(responseJSON);
		});
}

inputInformation = {
	id : "",
	name : ""
}

function submitLecture() {
	inputInformation.id = $("#idInput").val();
	inputInformation.name = $("#nameInput").val();
	console.log("ID: ");
	console.log(inputInformation.id);
	console.log("Name : ");
	console.log(inputInformation.name);
	addSportToDB(inputInformation);
}

function addSportToDB(inputValues) {
	let url = "./sports/api/post-sport";
	let settings = {
		method : "POST",
		headers : {
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify({id : inputValues.id, name : inputValues.name})
	};

	fetch(url, settings)
		.then(response => {
			//all the 200s are going to be "OK"
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		});
		/*.then(responseJSON => {
			displaySportList(responseJSON);
		});	*/
}

//read data from registry from
$("#submitNewSport").on("click", function(event){
	event.preventDefault();
	submitLecture();
	$("#formNewSport").trigger("reset");
});

$(onload);