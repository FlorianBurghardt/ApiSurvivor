<?php
#region usings
namespace de\fburghardt\ApiSurvivor\Application\Parts;

use de\fburghardt\Library\HTML\Tag\Area\Aside;
use de\fburghardt\Library\HTML\Tag\Block\Div;
use de\fburghardt\Library\HTML\Tag\Body;

#endregion

class Environment_Menu
{
	#region properties
	private Aside $environment;
	private Div $environmentHeader;
	private Div $environmentBody;
	private array $menues;
	#endregion

	#region constructor
	public function __construct(Body $body)
	{
		$this->setEnvironment($body);
		$this->setEnvironmentHeader();
		$this->setEnvironmentBody();
	}
	#endregion

	#region getter
	public function getEnvironment(): Aside { return $this->environment; }
	#endregion

	#region setter
	private function setEnvironment(Body $body): void
	{
		$this->environment = new Aside(
			[
				'id'=>'EnvironmentMenu',
				'class'=>'offcanvas offcanvas-end text-bg-dark width-full',
				'aria' =>
				[
					'labelledby' => 'EnvironmentMenuHeaderTitle'
				]
			],
			'EnvironmentMenu'
		);
		$body->add($this->environment);
	}
	private function setEnvironmentHeader(): void
	{
		$this->environmentHeader = new Div(
			[
				'id'=>'EnvironmentMenuHeader',
				'class'=>'offcanvas-header border-bottom border-1 border-secondary',
				'innerContent' =>
				[
					[
						'tag' => 'H5',
						'attributes' =>
						[
							'id' => 'EnvironmentMenuHeaderTitle',
							'class' => 'offcanvas-title',

						],
						'innerContent' =>
						[
							[
								'content' => 'Environment Menu'
							]
						]
					],
					[
						'tag' => 'Button',
						'attributes' =>
						[
							'tagID' => 'EnvironmentMenuCloseButton',
							'type' => 'button',
							'class' => 'btn-close btn-close-white',
							'data' =>
							[
								'bs-dismiss' => 'offcanvas'
							],
							'aria' =>
							[
								'label' => 'Close'
							]
						]
					]
				]
			],
			'EnvironmentMenuHeader'
		);
		$this->environment->add($this->environmentHeader);
	}
	private function setEnvironmentBody(): void
	{
		$this->environmentBody = new Div(
			[
				'id'=>'EnvironmentMenuBody',
				'class'=>'offcanvas-body',
				'innerContent' =>
				[
					[
						'tag' => 'Ul',
						'attributes' =>
						[
							'id' => 'EnvironmentMenuList',
							'class' => 'navbar-nav justify-content-start flex-grow-1 pe-3'
						]
					]
				]
			],
			'EnvironmenteMenuBody'
		);
		$this->environment->add($this->environmentBody);
		$this->menues['environment-menu'] = $this->environment::getTagById('EnvironmentMenuList');
	}
	#endregion
}
?>