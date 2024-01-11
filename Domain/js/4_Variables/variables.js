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
		},
		{
			'id':'UserSettingsList',
			'name':'UserSetting'
		}
	],
	'types':
	{
		'FOLDER': 'Workspace',
		'REQUEST': 'Workspace',
		'LIST': 'Environment',
		'ACTIVE_REQUEST': 'Active',
		'USER_SETTING': 'UserSetting'
	}
};

// Allowed Request Methods
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
const program = new Program(database);
const data = new DBHandler(database);