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
	
	var worspace = document.getElementById("WorkspaceMenuBody");
	var addButton = document.createElement("Button");
	addButton.id = "Add_UserSettings";
	addButton.textContent = "Add UserSettings";
	addButton.onclick = function () { addSettings() };
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
function languageChange(language = 'EN')
{
	contentManager.setLanguage(language);
}

// TODO: Temporary test data
function add()
{
	try
	{
		// 'Workspace'
		var id = contentManager.addElement('FOLDER', 'CardService');
		id = contentManager.addElement('FOLDER', 'Cards', id);
		contentManager.addElement('REQUEST', 'Card', id);
		contentManager.addElement('REQUEST', 'Card', id);
		id = contentManager.addElement('FOLDER', 'MoreCards', id);
		contentManager.addElement('REQUEST', 'Card', id);
		contentManager.addElement('REQUEST', 'Card', id);
		id = contentManager.addElement('FOLDER', 'CDC-Integration');
		contentManager.addElement('REQUEST', 'CustomerByUID', id);
		contentManager.addElement('REQUEST', 'CustomerByEmail', id);
		// 'Environment'
		contentManager.addElement('LIST', 'Dev');
		contentManager.addElement('LIST', 'PreProd');
		contentManager.addElement('LIST', 'Prod');
	}
	catch (error)
	{
		console.log(error);
	}
}
function addSettings()
{
	try
	{
		contentManager.addElement('USERSETTINGS', 'Language');
	}
	catch (error)
	{
		console.log(error);
	}
}
//#endregion