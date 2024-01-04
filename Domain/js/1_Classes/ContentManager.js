/**
 * Class to handle all content usecases in the API-Survivor.
 * @param {object} _database - Associated database {object}.
 * @property {string} _database.name - The name of the database.
 * @property {number} _database.version - The version of the database.
 * @property {array[{object}]} _database.tables - The tables in the database.
 * @property {string} _database.tables[0].id - The id of the DOM container in the HTML document.
 * @property {string} _database.tables[0].name - The name of the table in the database.
 */
class ContentManager
{
	//#region Constructor
	/**
	 * Constructor for the class.
	 * @param {object} _database - Associated database {object}.
	 * - {string} _database.name - The name of the database.
	 * - {number} _database.version - The version of the database.
	 * - {array[{object}]} _database.tables - The tables in the database.
	 * - {string} _database.tables[0].id - The id of the DOM element in the HTML document.
	 * - {string} _database.tables[0].name - The name of the table in the database.
	 * @throws {Exception} [1000] - If the _database.name is not defined.
	 * @throws {Exception} [1001] - If the _database.version is not defined.
	 * @throws {Exception} [1002] - If the _database.tables is not defined.
	 * @throws {Exception} [1003] - If the _database.tables[].id is not defined.
	 * @throws {Exception} [1004] - If the _database.tables[].name is not defined.
	 * @throws {Exception} [1005] - If the HTML element with id _database.tables[].id is not found.
	 */
	constructor(_database)
	{
		if (_database.name === undefined) { throw new Exception('_database.name{string} is not defined', 1000); }
		if (_database.version === undefined) { throw new Exception('_database.version{number} is not defined', 1001); }
		if (_database.tables === undefined) { throw new Exception('_database.tables{array} is not defined', 1002); }

		this.databaseName = _database.name;
		this.databaseVersion = _database.version;
		this.databaseTables = _database.tables;

		this.databaseTables.forEach((table) =>
		{
			if (table.skip === true) { return; }
			if (table.id === undefined) { throw new Exception('_database.tables[].id{string} is not defined', 1003); }
			if (table.name === undefined) { throw new Exception('_database.tables[].name{string} is not defined', 1004); }
			table.container = document.getElementById(table.id);
			if (table.container === null) { throw new Exception('HTML element with id "' + table.id + '" not found', 1005); }
		});

		this.tableTypes = _database.types;
		
		this.DOMHandler = new DOMHandler();
		this.DBHandler = new DBHandler(_database);
		this.restoreAllElements();
	}
	//#endregion

	//#region Getter / Setter
	getAttribute(_elementId, _attribute) { return this.DOMHandler.getAttribute(_elementId, _attribute); }
	setAttribute(_elementId, _attributeName, _attributeValue) { return this.DOMHandler.setAttribute(_elementId, _attributeName, _attributeValue); }
	//#endregion

	//#region Public Methods
	/**
	 * Adds an element to the HTML document and saves it in the database.
	 * @param {string} _type - The type of the element. Must be in the _database.tables.["tableName"].types{array}.
	 * @param {string} _name - The name of the element in the HTML document.
	 * @param {string|null} _directParentId - The id of the direct parent in the HTML document. If null, the parent is the root of the _database.tables{array} that contains to the _type.
	 * @default _directParentId = null
	 * @return {string} The id the DOM element has been get in the HTML document.
	 * @throws {Exception} [1100] - If the _type is not defined.
	 * @throws {Exception} [1101] - If the _name is not defined.
	 * @throws {Exception} [1102] - If the new element could not be created in the HTML document.
	 */
	addElement(_type, _name, _directParentId = null)
	{
		if (_type === undefined) { throw new Exception('_type{string} is not defined', 1100); }
		if (_name === undefined) { throw new Exception('_name{string} is not defined', 1101); }

		let table = this._getTableByType(_type);
		let directParent = this.DOMHandler.getElementById(_directParentId);

		const newElement = this.DOMHandler.createElementByType(_type, _name, table.container, directParent);

		if (newElement === null || newElement === undefined) { throw new Exception('Could not create new element', 1102); }

		this.DBHandler.addToDatabase({ id: newElement.id, name: newElement.name, type: newElement.type, parentID: newElement.parentID, method: newElement.method }, table.name);
		
		return newElement.id;
	}

	/**
	 * Restores all elements from the database to the HTML document.
	 * @return {void} No return value.
	 */
	restoreAllElements()
	{
		this.databaseTables.forEach((table) =>
		{
			this.DBHandler.getManyFromDatabase(table.name, null, {'structure' : 1, 'id' : 1})
			.then((result) =>
			{
				result.forEach((element) =>
				{
					var parent = null;
					if (element.parentID !== table.id) { parent = this.DOMHandler.getElementById(element.parentID); }
					this.DOMHandler.createElementByType(element.type, element.name, table.container, parent, element.id, element.method);
				});
			});
		});
	}

	updateElementById(_type, _id)
	{
		
	}
	//#endregion
	
	//#region Private Methods
	/**
	 * @private Checks the _type parameter against the types{array}.
	 * @param {string} _type - The _type to be checked in types{object}.
	 * @return {object} The table that contains to the _type.
	 * @throws {Exception} [1900] - If the _type is no valid element of types{object}.
	 * @throws {Exception} [1901] - If the _database.tables[].name is not defined.
	 */
	_getTableByType(_type)
	{
		let tableName = null;
		if (this.tableTypes.hasOwnProperty(_type)) { tableName = this.tableTypes[_type]; }
		if (tableName === null) { throw new Exception('_type: "' + _type + '" is no valid element of types[' + Object.keys(this.tableTypes)+ ']', 1900); }

		let table = null;
		this.databaseTables.forEach((databaseTable) =>
		{
			if (tableName === databaseTable.name)
			{
				table = databaseTable;
				return;
			}
		});
		if (table === null) { throw new Exception('"' + tableName + '" is not defined in the _database.tables[].name{string}', 1901); }

		return table;
	}
	//#endregion
}