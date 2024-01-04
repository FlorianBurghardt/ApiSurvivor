<?php
#region usings
namespace de\fburghardt\ApiSurvivor\Application\Controller;

use de\fburghardt\ApiSurvivor\Application\Parts\ActiveRequest_Menu;
use de\fburghardt\ApiSurvivor\Application\Parts\Environment_Menu;
use de\fburghardt\ApiSurvivor\Application\Parts\Page_Header;
use de\fburghardt\ApiSurvivor\Application\Parts\Page_Scripts;
use de\fburghardt\ApiSurvivor\Application\Parts\Workspace_Menu;
use de\fburghardt\Library\Helper\FileLoader;
use de\fburghardt\Library\Helper\JSON;
use de\fburghardt\Library\HTML\Elementgroup\Site;
use de\fburghardt\Library\HTML\Tag\Body;
use de\fburghardt\Library\HTML\Tag\Head;
use de\fburghardt\Library\HTML\Tag\Head\Title;
use de\fburghardt\Library\HTML\Tag\HTML;
#endregion

class StartUp
{
	#region properties
	protected HTML $html;
	protected Head $head;
	protected Body $body;
	#endregion
	
	#region constructor
	public function __construct()
	{
		$_SERVER['config'] = JSON::decode(file_get_contents('../Application/config/config.json'), true);

		$site = new Site();
		$this->html = $site->getHtml();
		$this->head = $site->getHead();
		$this->body = $site->getBody();

		$this->head->add($_SERVER['config']['headElements'], 'JSON_FILE');
		$title = new Title(['title' => $_SERVER['config']['title']]);
		$this->head->add($title);

		$this->body->addEvents(['onload' => 'ready()', 'onresize' => 'resize()']);
		$this->setHeader();
		$this->setWorkspaceMenu();
		$this->setEnvironmentMenu();
		$this->setActiveRequestMenu();
		$this->setScripts();
	}
	#endregion

	#region methods
	private function setHeader(): void { new Page_Header($this->body); }
	private function setWorkspaceMenu(): void { new Workspace_Menu($this->body); }
	private function setEnvironmentMenu(): void { new Environment_Menu($this->body); }
	private function setActiveRequestMenu(): void { new ActiveRequest_Menu($this->body); }
	private function setScripts(): void
	{
		$spageScripts = new Page_Scripts($_SERVER['config']['externalScripts'], $this->body);
		$dir = dirname(__DIR__, 2).'/Domain/js/*';
		$arr = FileLoader::scan($dir);
		$arr = FileLoader::trim($arr, '/js/', true);
		$arr = FileLoader::addpath($arr, 'https://apisurvivor.fburghardt.de/js/');
		$spageScripts->addScriptsByNames($arr);

	}
	#endregion
}
?>