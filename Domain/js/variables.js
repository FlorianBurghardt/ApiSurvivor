// General variables
var header;
var headerSpace;
var height;
const dataPrefix = 'data-apisurvivor-';

// Listmenu variables
var database =
{
	'name': 'API-Survivor',
	'version': 1,
	'tables':
	[
		{
			'id':'WorkspaceMenuList',
			'name':'Workspace'
		},
		{
			'id':'EnvironmentMenuList',
			'name':'Environment'
		},
		{
			'id':'ActiveList',
			'name':'Active'
		}
	],
	'types':
	{
		'FOLDER': 'Workspace',
		'REQUEST': 'Workspace',
		'LIST': 'Environment',
		'ACTIVE_REQUEST': 'Active'
	}
};

// Request constants
const RequestMethod = 
{
	'GET':'GET',
	'POST':'POST',
	'PUT':'PUT',
	'PATCH':'PATCH',
	'DELETE':'DELETE',
	'HEAD':'HEAD',
	'OPTIONS':'OPTIONS'
};

// Application initialization
const contentManager = new ContentManager(database);