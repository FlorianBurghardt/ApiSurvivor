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

			transaction.oncomplete = (event) => { db.close(); }
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