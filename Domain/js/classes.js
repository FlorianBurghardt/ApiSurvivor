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
			if (table.id === undefined) { throw new Exception('_database.tables[].id{string} is not defined', 1003); }
			if (table.name === undefined) { throw new Exception('_database.tables[].name{string} is not defined', 1004); }
			table.container = document.getElementById(table.id);
			if (table.container === null) { throw new Exception('HTML element with id "' + table.id + '" not found', 1005); }
		});

		this.tableTypes = _database.types;
		
		this.DOMHandler = new DOMHandler();
		this.DBHandler = new DBHandler(_database);
	}
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
				console.log(result);
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

/**
 * Class to handle special DOM elements / element groups.
 * @property {array} this.idList - Stores all DOM element ids from HTML doument.
 */
class DOMHandler
{
	//#region Constructor
	/**
	 * Constructor to handle DOM elements.
	 * @property {array} this.idList - Stores all DOM element ids from HTML doument.
	 */
	constructor()
	{
		this.idList = this.getAllElementIds();
	}
	//#endregion

	//#region Getter
	/**
	 * Get the DOM element with the given _id.
	 * @param {string} _id The id of the DOM element to search.
	 * @return DOM element or null if not found
	 */
	getElementById(_id) { return document.getElementById(_id); }

	/**
	 * Loads all DOM element ids from HTML doument.
	 * @return {array} The list of all DOM element ids.
	 */
	getAllElementIds()
	{
		let idList = [];
		var elements = document.getElementsByTagName("*");
		for (const element of elements)
		{
			if (element.id)
			{
				idList.push(element.id);
			}
		}
		return idList;
	}
	//#endregion

	//#region Public Methods
	/**
	 * Create an special element / (element group) by type.
	 * @param {string} _type - The type of the element.
	 * @param {string} _name - The name of the element.
	 * @param {object} _parentContainer - The parent container element.
	 * @param {object} _directParent - The direct parent element. Default is null.
	 * @param {string} _id - The ID of the element.
	 * @return {object} An object with the following properties:
	 * - newElement.element - The created DOM element.
	 * - newElement.id - The ID of the created element.
	 * - newElement.parentId - The ID of the direct parent element.
	 * - newElement.name - The name of the created element.
	 * - newElement.type - The type of the created element.
	 * - newElement.method - The request method of the element. Only set if type is "REQUEST".
	 * @throws {Exception} [2000] - If the _type is not a string.
	 * @throws {Exception} [2001] - If the _name is not a string.
	 * @throws {Exception} [2002] - If the _parentContainer is not a DOM element.
	 * @throws {Exception} [2003] - If the _directParent is not a DOM element.
	 * @throws {Exception} [2004] - If the _id is not a string.
	 * @throws {Exception} [2005] - If the _type is not a valid type.
	 * @throws {Exception} [2006] - If the _method is not a valid request method.
	 */
	createElementByType(_type, _name, _parentContainer, _directParent = null, _id = null, _requestMethod = null)
	{
		if (_type === undefined || typeof _type !== 'string') { throw new Exception('Type "' + _type + '" is not a string', 2000); }
		if (_name === undefined || typeof _name !== 'string') { throw new Exception('Name "' + _name + '" is not a string', 2001); }
		if (_parentContainer === undefined || !this.isElement(_parentContainer)) { throw new Exception('Parent container "' + _parentContainer + '" is not a DOM element', 2002); }
		if (_directParent !== null && !this.isElement(_directParent)) { throw new Exception('Direct parent "' + _directParent + '" is not a DOM element', 2003); }
		if (_id !== null && typeof _id !== 'string') { throw new Exception('ID "' + _id + '" is not a string', 2004); }
	
		var newElement = [];
		newElement.type = _type;
		newElement.name = _name;
		newElement.id = _id !== null ? this._createID(_id, true) : this._createID(_name);

		var parent = _directParent !== null ? _directParent : _parentContainer;
		newElement.parentID = parent.id

		switch (_type)
		{
			case 'LIST':
				newElement.element = this._createListElement(newElement.id, newElement.name, parent);
				break;
			case 'FOLDER':
				newElement.element = this._createFolderElement(newElement.id, newElement.name, parent);
				break;
			case 'REQUEST':
				if (_requestMethod !== null)
				{
					if (typeof _requestMethod === 'string') { _requestMethod =  _requestMethod.toUpperCase(); }
					if (RequestMethod[_requestMethod] === undefined) { throw new Exception('No valid request method "' + _requestMethod + '"', 2005); }
				}
				else { _requestMethod = 'GET'; }
				newElement.method = _requestMethod;
				newElement.element = this._createRequestElement(newElement.id, newElement.name, parent, newElement.method);
				break;
			default:
				throw new Exception('Undefined type "' + newElement.type + '". Element could not be created', 2006);
		}
		return newElement;
	}

	updateContentById(_id, _newContent)
	{
		// TODO Implement
		// const element = this.getElementById(_id);
		// if (element)
		// {
		// 	element.textContent = _newContent;
		// }
	}

	/**
	 * Checks if the given _element is a DOM element.
	 * @param {object} _element Element to check.
	 * @return {boolean} True if _element is a DOM element.
	 */
	isElement(_element) { return _element instanceof Element; }
	//#endregion
	
	//#region Private Methods
	/**
	 * @private Creates a new list element and appends it to the parent element.
	 * @param {string} _id - The ID of the new list element.
	 * @param {string} _name - The text content of the new list element.
	 * @param {Element} _parent - The parent element to append the new list element to.
	 * @return {Element} The newly created list element.
	 */
	_createListElement(_id, _name, _parent)
	{
		const newListItem = document.createElement('li');
		newListItem.id = _id;
		newListItem.textContent = _name;
		newListItem.type = 'LIST';

		_parent.appendChild(newListItem);
		return newListItem;
	}

	/**
	 * Creates a new folder element group and appends it to the parent element.
	 * @param {string} _id - The ID of the new folder element group.
	 * @param {string} _name - The text content of the new folder element group.
	 * @param {Element} _parent - The parent element to append the new folder element group to.
	 * @return {Element} - The newly created element of the folder element group with the given _id.
	 */
	_createFolderElement(_id, _name, _parent)
	{
		const newFolder = document.createElement('li');
		newFolder.className = 'border-bottom border-1 border-secondary';

		const newList = document.createElement('ul');
		newList.style.listStyle = 'none';
		newFolder.appendChild(newList);
		newList.id = _id;
		newList.type = 'FOLDER';

		const newFolderIcon = document.createElement('i');
		newFolderIcon.className = 'bi bi-folder';
		newList.appendChild(newFolderIcon);
		
		const newContent = document.createElement('span');
		newContent.textContent = ' ' + _name;
		newContent.id = _id + '_name';
		newList.appendChild(newContent);

		_parent.appendChild(newFolder);
		return newList;
	}

	/**
	 * Creates a new request element group and appends it to the parent element.
	 * @param {string} _id - The ID of the new request element group.
	 * @param {string} _name - The name of the new request element group.
	 * @param {Element} _parent - The parent element to which the new request element will be appended.
	 * @param {string} [_requestMethod] - The request method of the new request element. Default is 'GET'.
	 * @return {Element} - The newly created element of the request element group with the given _id.
	 */
	_createRequestElement(_id, _name, _parent, _requestMethod = 'GET')
	{
		const newRequest = document.createElement('li');
		newRequest.id = _id;
		newRequest.type = 'REQUEST';

		const newRequestMethod = document.createElement('span');
		newRequestMethod.className = 'request-method method-' + _requestMethod;
		newRequestMethod.textContent = _requestMethod;
		newRequestMethod.id = _id + '_method';
		newRequest.appendChild(newRequestMethod);

		const newRequestContent = document.createElement('span');
		newRequestContent.textContent = ' ' + _name;
		newRequestContent.id = _id + '_name';
		newRequest.appendChild(newRequestContent);

		_parent.appendChild(newRequest);
		return newRequest;
	}

	/**
	 * Generates a new ID based on the given _id.
	 * @param {string} _id - The name used to generate the ID. If the ID already exists, a new ID will be generated based on the given ID.
	 * @param {boolean} _isStaticID - Defines if the given ID is static and it is forbidden to be modified.
	 * @return {string} The newly generated ID.
	 * @throws {Exception} If the given ID already exists and _isStaticID is true.
	 */
	_createID(_id, _isStaticID = false)
	{
		if (_isStaticID && this.idList.includes(_id)) { throw new Exception('ID "' + _id + '" already exists', 1007); }

		let initialId = _id.replace(/[^a-zA-Z-0-9-]/g, "");
		let id = initialId;
		let count = 0;

		while (this.idList.includes(id)) { id = initialId + '_' + ++count; }
		this.idList.push(id);
		return id;
	}
	//#endregion
}

/**
 * Class to handle datastorage in a indexedDB in the browser.
 * @param {object} _database - Associated database {object}.
 * @property {string} _database.name - The name of the database.
 * @property {number} _database.version - The version of the database.
 * @property {array[{object}]} _database.tables - The tables in the database.
 * @property {string} _database.tables[0].id - The id of the DOM container in the HTML document.
 * @property {string} _database.tables[0].name - The name of the table in the database.
 * @property {string[]} _database.tables[0].types - The types of valid elements / element groups for this table.
 */
class DBHandler
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
	 * - {string[]} _database.tables[0].types - The types of valid elements in the HTML document.
	 * @throws {Exception} [3000] - If the _database.name is not defined.
	 * @throws {Exception} [3001] - If the _database.version is not defined.
	 * @throws {Exception} [3002] - If the _database.tables is not defined.
	 * @throws {Exception} [3003] - If the _database.tables[].id is not defined.
	 * @throws {Exception} [3004] - If the _database.tables[].name is not defined.
	 */
	constructor(_database)
	{
		if (_database.name === undefined) { throw new Exception('_database.name{string} is not defined', 3000); }
		if (_database.version === undefined) { throw new Exception('_database.version{number} is not defined', 3001); }
		if (_database.tables === undefined) { throw new Exception('_database.tables{array} is not defined', 3002); }

		this.databaseName = _database.name;
		this.databaseVersion = _database.version;
		this.databaseTables = _database.tables;

		this.elementStructure = {};
		this.databaseTables.forEach((table) =>
		{
			if (table.id === undefined) { throw new Exception('_database.tables[].id{string} is not defined', 3003); }
			if (table.name === undefined) { throw new Exception('_database.tables[].name{string} is not defined', 3004); }
			this.elementStructure[table.name] = {};
		});
		this.response = [];
	}
	//#endregion

	//#region Public Database Methods
	/**
	 * Adds an element to the database.
	 * @param {object} _data - The data to be added to the database.
	 * @param {string} _tableName - The name of the table in the database.
	 */
	addToDatabase(_data, _tableName)
	{
		_data = this._updateStructure(_tableName, _data);
		const request = this._connectToDatabase();
		request.onsuccess = (event) =>
		{
			const db = event.target.result;
			const transaction = db.transaction(_tableName, 'readwrite');
			const store = transaction.objectStore(_tableName);
			store.put(_data);

			transaction.oncomplete = (event) =>
			{
				db.close();
			}
		};
	}

	/**
	 * Retrieves multiple records from the database.
	 * @param {string} _tableName - The name of the table to retrieve records from.
	 * @param {object} _filter - Optional. An object specifying the filter criteria for the records.
	 * @default _filter = null;
	 * @param {object} _sort - Optional. An object specifying the sort criteria for the records.
	 * @default _sort = null;
	 * @example _sort = { name: 1, id: -1 };
	 * @example _sort = { name: 'asc', id: 'desc' };
	 * @example _sort = { firstPriority, secondPriority, ..., lastPriority };
	 * @example _sort Valid sort values for ASC: 'asc', 'ASC', 1, true
	 * @example _sort Valid sort values for DESC: 'desc', 'DESC', -1, 0, false
	 * @return {array} An array of records retrieved from the database.
	 */
	getManyFromDatabase(_tableName, _filter = null, _sort = null)
	{
		return new Promise((resolve, reject) => 
		{
			let data = [];
			const request = this._connectToDatabase();
			
			request.onsuccess = (event) =>
			{
				const db = event.target.result;
				const transaction = db.transaction(_tableName, 'readonly');
				const store = transaction.objectStore(_tableName);
				const getRequest = store.getAll(_filter);
				
				getRequest.onsuccess = () => 
				{
					const response = getRequest.result;
					response.forEach((element) => { data.push(element); });
					
					if (_sort !== null) { data = this.sort(data, _sort); }
					resolve(data);
				};
				
				transaction.oncomplete = (event) => { db.close(); };
			};
			
			request.onerror = (event) =>
			{
				reject(new Exception('Error retrieving data from the database:' + event, 3200));
			};
		});
	}
	  

	/**
	 * Sorts the given data based on the specified sort criteria.
	 * @param {array} _data - The data to be sorted.
	 * @param {object} _sort - The sort criteria.
	 * @example _sort = { name: 1, id: -1 };
	 * @example _sort = { name: 'asc', id: 'desc' };
	 * @example _sort = { firstPriority, secondPriority, ..., lastPriority };
	 * @example _sort Valid sort values for ASC: 'asc', 'ASC', 1, true
	 * @example _sort Valid sort values for DESC: 'desc', 'DESC', -1, 0, false
	 * @return {array} - The sorted data.
	 * @throws {Exception} [3200] - If the sort value is invalid.
	 */
	sort(_data, _sort)
	{
		for (var [key, value] of Object.entries(_sort).reverse())
		{
			if (value === 1 || value === true || value === 'ASC') { value = 'asc'; }
			if (value === -1 || value === 0 || value === false || value === 'DESC') { value = 'desc'; }
			if (value !== 'asc' && value !== 'desc') { throw new Exception('Invalid sort value:' + value + ' for key:' + key, 3200); }

			if (value === 'desc') { _data = _data.sort((a, b) => b[key] > a[key]); }
			else { _data = _data.sort((a, b) => a[key] > b[key]); }
		}
		return _data;
	}
	//#endregion

	//#region Private Database Methods
	/**
	 * @private Connects to the indexedDB and creates the tables in the database.
	 * @return {object} Database request object.
	 * @throws {Exception} [3100] - If the database could not be opened.
	 */
	_connectToDatabase()
	{
		const request = indexedDB.open(this.databaseName, this.databaseVersion);

		request.onerror = (event) => { throw new Exception('Unable to connect to database:' + event, 3100); };

		request.onupgradeneeded = (event) =>
		{
			const db = event.target.result;
			for (const table of this.databaseTables)
			{
				if (!db.objectStoreNames.contains(table.name))
				{
					db.createObjectStore(table.name, { keyPath: 'id' });
				}
			}
		};
		return request;
	}

	_updateStructure(_tableName, _data)
	{
		if (!this.elementStructure[_tableName].hasOwnProperty(_data.parentID))
		{
			this.elementStructure[_tableName][_data.parentID] = 0;
		}
		this.elementStructure[_tableName][_data.id] = this.elementStructure[_tableName][_data.parentID] + 1;
		_data.structure = this.elementStructure[_tableName][_data.id];

		return _data;
	}
	//#endregion
}

/**
 * The specific exception class for the API-Survivor.
 * @extends Error
 * @param {string} message - The error message
 * @param {number} code - The error code
 * @example throw new Exception('An error occurred', 6000);
 * @example Console output: Exception(6000): An error occurred;
 */
class Exception extends Error
{
	constructor(message, code)
	{
		super(message);
		this.code = code;
		this.name = 'Exception(' + code + ')';
	}
}