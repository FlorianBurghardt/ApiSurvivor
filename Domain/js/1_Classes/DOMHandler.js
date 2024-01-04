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
	constructor() { this.idList = this.getAllElementIds(); }
	//#endregion

	//#region Getter / Setter
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
			if (element.id) { idList.push(element.id); }
		}
		return idList;
	}

	/**
	 * Retrieves the value of the specified attribute from the element with the given ID.
	 * @param {string} _elementId - The ID of the element to retrieve the attribute from.
	 * @param {string} _attribute - The name of the attribute to retrieve without the data-prefix.
	 * @return {string|null} The value of the specified attribute, or null if the element or attribute does not exist.
	 */
	getAttribute(_elementId, _attribute)
	{
		var element = document.getElementById(_elementId);
		if (element === null || element === undefined) { return null; }
		return element.getAttribute(dataPrefix + _attribute);
	}

	/**
	 * Sets the attribute value of an element with the given ID.
	 * @param {string} _elementId - The ID of the element.
	 * @param {string} _attributeName - The name of the attribute without the data-prefix.
	 * @param {string} _attributeValue - The value to set for the attribute.
	 * @return {boolean} Returns true if the attribute is set successfully, or null if the element is not found.
	 */
	setAttribute(_elementId, _attributeName, _attributeValue)
	{
		var element = document.getElementById(_elementId);
		if (element === null || element === undefined) { return null; }
		element.setAttribute(dataPrefix + _attributeName, _attributeValue);
		return true;
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
			// ToDo: CleanUp this switch remove methods to separate classes
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

		_parent.appendChild(newListItem);
		this.setAttribute(newListItem.id, 'type', 'LIST');
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

		const newFolderIcon = document.createElement('i');
		newFolderIcon.className = 'bi bi-folder';
		newList.appendChild(newFolderIcon);
		
		const newContent = document.createElement('span');
		newContent.textContent = ' ' + _name;
		newContent.id = _id + '_name';
		newList.appendChild(newContent);

		_parent.appendChild(newFolder);
		this.setAttribute(newList.id, 'type', 'FOLDER');
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
		this.setAttribute(newRequest.id, 'type', 'REQUEST');
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