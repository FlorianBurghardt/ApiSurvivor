<?php
#region usings
namespace de\fburghardt\ApiSurvivor\Application\Parts;

use de\fburghardt\Library\HTML\Tag\Area\Header;
use de\fburghardt\Library\HTML\Tag\Block\Div;
use de\fburghardt\Library\HTML\Tag\Body;
use de\fburghardt\Library\HTML\Tag\Form\Button;
use de\fburghardt\Library\HTML\Tag\Inline\Span;
#endregion

class Page_Header
{
	#region properties
	private Header $headerBar;
	private Div $headerContainer;
	#endregion

	#region constructor
	public function __construct(Body $body)
	{
		$this->setHeaderBar($body);
		$this->setHeaderSpace($body);
		$this->setHeaderContainer();
		$this->setHeaderElements();
	}
	#endregion

	#region getter
	public function getHeader(): Header { return $this->headerBar; }
	#endregion

	#region setter
	private function setHeaderBar(Body $body): void
	{
		$this->headerBar = new Header(
			[
				'id'=>'HeaderBar',
				'class'=>'navbar navbar-dark bg-dark fixed-top'
			],
			'HeaderBar'
		);
		$body->add($this->headerBar);
	}
	private function setHeaderSpace(Body $body): void
	{
		$headerSpace = new Div(
			[
				'id'=>'HeaderSpace',
				'style'=>'height: 56px;'
			],
			'HeaderSpace'
		);
		$body->add($headerSpace);
	}
	private function setHeaderContainer(): void
	{
		$this->headerContainer = new Div(
			[
				'id'=>'HeaderContainer',
				'class'=>'container-fluid'
			],
			'HeaderContainer'
		);
		$this->headerBar->add($this->headerContainer);
	}
	private function setHeaderElements(): void
	{
		$headerElements = [];
		$headerElements[0] = new Button(
			[
				'id' => 'WorkspaceNavButton',
				'class' => 'navbar-toggler',
				'type' => 'button',
				'data' =>
				[
					'bs-toggle' => 'offcanvas',
					'bs-target' => '#WorkspaceMenu'
				],
				'aria' =>
				[
					'controls' => 'WorkspaceMenu'
				],
				'innerContent' =>
				[
					[
						'tag' => 'Span',
						'attributes' =>
						[
							'id' => 'WorkspaceMenuIcon',
							'class' => 'navbar-toggler-icon'
						]
					]
				]
			],
			'WorkspaceNavButton'
		);

		$headerElements[1] = new Span(
			[
				'id'=>'HeaderTitle',
				'class'=>'navbar-brand mx-1'
			],
			'HeaderTitle'
		);
		$headerElements[1]->add($_SERVER['config']['headerTitle']);

		$headerElements[2] = new Button(
			[
				'id' => 'EnvironmentMenuButton',
				'class' => 'navbar-toggler',
				'type' => 'button',
				'data' =>
				[
					'bs-toggle' => 'offcanvas',
					'bs-target' => '#EnvironmentMenu'
				],
				'aria' =>
				[
					'controls' => 'EnvironmentMenu'
				],
				'innerContent' =>
				[
					[
						'tag' => 'Span',
						'attributes' =>
						[
							'id' => 'EnvironmentMenuIcon',
							'class' => 'navbar-toggler-icon'
						]
					]
				]
			],
			'EnvironmentMenuButton'
		);

		foreach ($headerElements as $headerElement) {
			$this->headerContainer->add($headerElement);
		}
	}
	#endregion
}
?>