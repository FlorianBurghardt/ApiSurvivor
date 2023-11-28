// Event variables
var header;
var headerSpace;
var height;

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
const contentManager = new ContentManager(database);