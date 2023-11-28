<?php
#region usings
namespace de\fburghardt\ApiSurvivor\Application\Controller;

use de\fburghardt\ApiSurvivor\Application\Parts\Environment_Menu;
use de\fburghardt\ApiSurvivor\Application\Parts\Page_Header;
use de\fburghardt\ApiSurvivor\Application\Parts\Page_Scripts;
use de\fburghardt\ApiSurvivor\Application\Parts\Workspace_Menu;
use de\fburghardt\Library\Helper\JSON;
use de\fburghardt\Library\HTML\Elementgroup\Site;
use de\fburghardt\Library\HTML\Tag\Block\Div;
use de\fburghardt\Library\HTML\Tag\Block\H1;
use de\fburghardt\Library\HTML\Tag\Body;
use de\fburghardt\Library\HTML\Tag\Form\Form;
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
	protected Form $form;
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
		$workspaceMenu = new Workspace_Menu($this->body);
		$environmentMenu = new Environment_Menu($this->body);
		
		// Page Content
		$h1 = new H1();
		$h1->add('ApiSurvivor');
		$this->body->add($h1);

		// TODO: Remove themporary 'ActiveList' container
		$activeMenu = new Div(['id' => 'ActiveList']);
		$this->body->add($activeMenu);


		$this->setScripts();
	}
	#endregion

	#region methods
	private function setHeader(): void
	{
		$header = new Page_Header($this->body);
		unset($header);
	}
	private function setScripts(): void
	{
		$scripts = new Page_Scripts($_SERVER['config']['scriptFiles'], $this->body);
		unset($scripts);
	}
	#endregion
}
?>