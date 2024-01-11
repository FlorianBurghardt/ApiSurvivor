//#region Events
// Site loading ready event
function ready()
{
	header = document.getElementById("HeaderBar");
	headerSpace = document.getElementById("HeaderSpace");
	setHeaderSpace();

	var worspace = document.getElementById("WorkspaceMenuBody");
	var addButton = document.createElement("Button");
	addButton.id = "Add_Button";
	addButton.textContent = "Add Elements";
	addButton.onclick = function () { add() };
	worspace.appendChild(addButton);

	var addButton = document.createElement("Button");
	addButton.id = "Test_Button";
	addButton.textContent = "DB Test";
	addButton.onclick = function () { db() };
	worspace.appendChild(addButton);
}
// Site resize event
function resize()
{
	setHeaderSpace();
}
// Update header background height
function setHeaderSpace()
{
	height = header.clientHeight;
	headerSpace.style.height = height + "px";
}
function languageChange(language = null)
{
	program.setLanguage(language);
}

// TODO: Temporary test data
function add()
{
	try
	{
		// 'Workspace'
		var id = program.addElement('FOLDER', 'CardService');
		id = program.addElement('FOLDER', 'Cards', id);
		program.addElement('REQUEST', 'Card', id);
		program.addElement('REQUEST', 'Card', id);
		id = program.addElement('FOLDER', 'MoreCards', id);
		program.addElement('REQUEST', 'Card', id);
		program.addElement('REQUEST', 'Card', id);
		id = program.addElement('FOLDER', 'CDC-Integration');
		program.addElement('REQUEST', 'CustomerByUID', id);
		program.addElement('REQUEST', 'CustomerByEmail', id);
		// 'Environment'
		program.addElement('LIST', 'Dev');
		program.addElement('LIST', 'PreProd');
		program.addElement('LIST', 'Prod');
	}
	catch (error)
	{
		console.log(error);
	}
}
function db()
{
	var newElement = {
		'id': 'Folder',
		'name': 'Test Folder',
		'type': 'FOLDER'
	};
	data.addToDatabase(newElement, 'Workspace');
}
//#endregion

//<button class="ms-2 btn btn-success btn-sm">...</button>