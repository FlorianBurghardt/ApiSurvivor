/**
 * Class to handle all content usecases in the API-Survivor.
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
	* - {string} _database.tables[0].id - The id of the DOM element container in the HTML document.
	* - {string} _database.tables[0].name - The name of the table in the database.
	* - {string[]} _database.tables[0].types - The types of valid elements / element groups for this table (tables.name).
	 * @throws {Exception} [1000] - If the _database.tables is not defined.
	 * @throws {Exception} [1001] - If the _database.tables[].id is not defined.
	 * @throws {Exception} [1002] - If the HTML element with id _database.tables[].id is not found.
	 */
	constructor(_database)
	{
		this.DOMHandler = new DOMHandler();
		this.DBHandler = new DBHandler(_database);
		this.elementTypes = _database.types;
		this.elementContainers = _database.tables;

		this.elementContainers.forEach((container) =>
		{
			if (container.skip === true) { return; }
			container.element = document.getElementById(container.id);
		});

		this.restoreAllElements();

		this.LanguageHandler = new LanguageHandler(this.DOMHandler);
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

		let elementContainer = this._getContainerByType(_type);
		let directParent = this.DOMHandler.getElementById(_directParentId);

		const newElement = this.DOMHandler.createElementByType(_type, _name, elementContainer.element, directParent);

		if (newElement === null || newElement === undefined) { throw new Exception('Could not create new element', 1102); }

		this.DBHandler.addToDatabase({ id: newElement.id, name: newElement.name, type: newElement.type, parentID: newElement.parentID, method: newElement.method }, elementContainer.name);
		
		return newElement.id;
	}

	/**
	 * Restores all elements from the database to the HTML document.
	 * @return {void} No return value.
	 */
	restoreAllElements()
	{
		this.elementContainers.forEach((container) =>
		{
			this.DBHandler.getManyFromDatabase(container.name, null, {'structure' : 1, 'id' : 1})
			.then((result) =>
			{
				result.forEach((element) =>
				{
					var parent = null;
					if (element.parentID !== container.id) { parent = this.DOMHandler.getElementById(element.parentID); }
					this.DOMHandler.createElementByType(element.type, element.name, container.element, parent, element.id, element.method);
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
	 * @return {object} The elementContainer that contains to the _type.
	 * @throws {Exception} [1900] - If the _type is no valid element of types{object}.
	 * @throws {Exception} [1901] - If the elementContainer is not defined.
	 */
	_getContainerByType(_type)
	{
		let containerName = null;
		if (this.elementTypes.hasOwnProperty(_type)) { containerName = this.elementTypes[_type]; }
		if (containerName === null) { throw new Exception('_type: "' + _type + '" is no valid element of types[' + Object.keys(this.elementTypes)+ ']', 1900); }

		let elementContainer = null;
		this.elementContainers.forEach((container) =>
		{
			if (containerName === container.name)
			{
				elementContainer = container;
				return;
			}
		});
		if (elementContainer === null) { throw new Exception('"' + containerName + '" is not defined in the elementContainer{string}', 1901); }

		return elementContainer;
	}
	//#endregion
}