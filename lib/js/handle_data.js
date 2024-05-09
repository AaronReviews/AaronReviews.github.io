const filepath = 'data/Routine.json';
let activeview, activeworkout, activeexercise;
let routineview = $("#routineview");
let workoutview = $("#workoutview");
let exerciseview = $("#exerciseview");
let workoutcontainer = $("#workoutcontainer");
let exercisecontainer = $("#exercisecontainer");
let workouttitle = $("#workouttitle");
let exercisetitle = $("#exercisetitle");

function create_button(btn_label) {
	let button = document.createElement("button");
	if (btn_label.match(/^\d+$/)) {
        button.innerText = parseInt(btn_label) + 1;
    } else {
		button.innerText = btn_label;
    }
	button.classList.add("bigbutton");
	button.addEventListener("click", () => {
		switch (activeview) {
			case 0:
				activeworkout = btn_label;
				load_workout(activeworkout);
				break;
			case 1:
				activeexercise = btn_label;
				load_exercise(activeworkout, activeexercise);
				break;
		}
	});
	return button;
}

function show_view(direction) {
	switch (activeview) {
		case 0:
			workoutcontainer.show();
			workoutview.css({"z-index": 1});
			routineview.hide();
			routineview.css({"z-index": 0});
			activeview++;
			break;
		case 1:
			if (direction == 0){
				exercisecontainer.show();
				exerciseview.css({"z-index": 1});
				workoutcontainer.hide()
				workoutview.css({"z-index": 0});
				activeview++;
			} else {
				routineview.show();
				routineview.css({"z-index": 1});
				workoutcontainer.hide();
				workoutview.css({"z-index": 0});
				activeview--;
			}
			break;
		case 2:
			workoutcontainer.show();
			workoutview.css({"z-index": 1});
			exercisecontainer.hide();
			exerciseview.css({"z-index": 0});
			activeview--;
			break;
	}
}

async function load_workout(key) {
	workoutcontainer.empty();
	workouttitle.text(activeworkout);
	fetch(filepath)
		.then((response) => response.json())
		.then((routine) => {
		for (r in routine[key]) {
			workoutcontainer.append(create_button(r));
		};
	});
	show_view(0);
}

async function load_exercise(key1, key2) {
	exercisecontainer.empty();
	let placeholder = parseInt(activeexercise) + 1
	exercisetitle.text(activeworkout + ": " + placeholder);
	fetch(filepath)
		.then((response) => response.json())
		.then((routine) => {
		for (r in routine[key1][key2]) {
			if (r == "superSet") {
				handle_superset(routine[key1][key2][r]);
			} else if (r == "reps") {
				handle_reps(routine[key1][key2][r]);
			} else { 		
				exercisecontainer.append(create_text_field(r, routine[key1][key2][r]));	
			}
		};
	});
	show_view(0);
}

function handle_superset(superset) {
	for (s in superset) {
		let placeholder = parseInt(s)+1;
		exercisecontainer.append(create_title_field("Exercise " + placeholder));
		for (r in superset[s]) {
			if (r == "reps") {
				handle_reps(superset[s][r]);
			} else { 	
				exercisecontainer.append(create_text_field(r, superset[s][r]));		
			}
		}
	}
}

function handle_reps(reps) {
	for (r in reps) {
		if (r == "alternate") {
			for (x in reps[r]) {
				if (x == 0) {
					exercisecontainer.append(create_text_field("reps", reps[r][x]['value'] + " x " + reps[r][x]['description']));
				} else {
					exercisecontainer.append(create_text_field("", reps[r][x]['value'] + " x " + reps[r][x]['description']));
				}
			}
		} else if (r == "range") {
			exercisecontainer.append(create_text_field("reps", reps[r][0] + " - " + reps[r][1]));
		} else {
			exercisecontainer.append(create_text_field("reps", reps[r]));
		}
	};
}

function create_text_field(text1, text2) {
	let text_field = document.createElement("div");
	text_field.classList.add("contentbar");
	let left_field = document.createElement("h2");
	left_field.classList.add("leftfield");
	left_field.innerText = text1;
	let right_field = document.createElement("h2");
	right_field.classList.add("rightfield");
	right_field.innerText = text2;
	text_field.appendChild(left_field);
	text_field.appendChild(right_field);
	return text_field;
}

function create_title_field(text) {
	let text_field = document.createElement("div");
	text_field.classList.add("contentbar");
	let left_field = document.createElement("h2");
	left_field.classList.add("centerfield");
	left_field.innerText = text;
	text_field.appendChild(left_field);
	return text_field;
}

async function start() {
	fetch(filepath)
		.then((response) => response.json())
		.then((routine) => {
		for(r in routine) {
			routineview.append(create_button(r));
		};
	});
}

$(".backbutton").on("click", {"direction": 1}, show_view);
routineview.css({"z-index": 1});
activeview = 0;
start();