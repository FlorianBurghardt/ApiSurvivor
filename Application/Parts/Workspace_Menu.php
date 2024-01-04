<?php
#region usings
namespace de\fburghardt\ApiSurvivor\Application\Parts;

use de\fburghardt\Library\HTML\Tag\Area\Aside;
use de\fburghardt\Library\HTML\Tag\Block\Div;
use de\fburghardt\Library\HTML\Tag\Body;
use de\fburghardt\Library\HTML\Tag\Lists\Li;
#endregion

class Workspace_Menu
{
	#region properties
	private Aside $workspace;
	private Div $workspaceHeader;
	private Div $workspaceBody;
	private Div $workspaceFooter;
	private array $menues;
	#endregion

	#region constructor
	public function __construct(Body $body)
	{
		$this->setWorkspace($body);
		$this->setWorkspaceHeader();
		$this->setWorkspaceBody();
		$this->setWorkspaceFooter();
	}
	#endregion

	#region getter
	public function getWorkspace(): Aside { return $this->workspace; }
	#endregion

	#region setter
	private function setWorkspace(Body $body): void
	{
		$this->workspace = new Aside(
			[
				'id'=>'WorkspaceMenu',
				'class'=>'offcanvas offcanvas-start text-bg-dark width-full',
				'aria' =>
				[
					'labelledby' => 'WorkspaceMenuHeaderTitle'
				]
			]
		);
		$body->add($this->workspace);
	}
	private function setWorkspaceHeader(): void
	{
		$this->workspaceHeader = new Div(
			[
				'id'=>'WorkspaceMenuHeader',
				'class'=>'offcanvas-header border-bottom border-1 border-secondary',
				'innerContent' =>
				[
					[
						'tag' => 'H5',
						'attributes' =>
						[
							'id' => 'WorkspaceMenuHeaderTitle',
							'class' => 'me-auto offcanvas-title'

						],
						'innerContent' =>
						[
							[
								'content' => 'Workspace Menu'
							]
						]
					],
					[
						'tag' => 'Button',
						'attributes' =>
						[
							'tagID' => 'WorkspaceMenuCloseButton',
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
			]
		);
		$this->workspace->add($this->workspaceHeader);
	}
	private function setWorkspaceBody(): void
	{		
		$this->workspaceBody = new Div(
			[
				'id'=>'WorkspaceMenuBody',
				'class'=>'offcanvas-body',
				'innerContent' =>
				[
					[
						'tag' => 'Ul',
						'attributes' =>
						[
							'id' => 'WorkspaceMenuList',
							'class' => 'navbar-nav justify-content-start flex-grow-1 pe-3'
						]
					]
				]
			]
		);
		$this->workspace->add($this->workspaceBody);
		$this->menues['workspace-menu'] = $this->workspace::getTagById('WorkspaceMenuList');
	}
	private function setWorkspaceFooter(): void
	{
		$this->workspaceFooter = new Div(
			[
				'id'=>'WorkspaceMenuFooter',
				'class'=>'d-flex border-top border-1 border-secondary',
				'innerContent' =>
				[
					[
						'tag' => 'Div',
						'attributes' =>
						[
							'id' => 'LanguageContainer',
							'class' => 'ms-auto p-2 align-self-center me-2'
						],
						'innerContent' =>
						[
							[
								'tag' => 'A',
								'attributes' =>
								[
									'id' => 'LanguageMenu',
									'class' => 'nav-link dropup justify-content-end',
									'href' => '#',
									'data' =>
									[
										'bs-toggle' => 'dropdown'
									],
									'aria' =>
									[
										'expanded' => 'false'
									],
									'innerContent' =>
									[
										[
											'tag' => 'Span',
											'attributes' =>
											[
												'id' => 'CurrentLanguage',
											]
										],
										[
											'tag' => 'I',
											'attributes' =>
											[
												'class' => 'bi bi-triangle-fill dropup-icon'
											]
										],
										[
											'tag' => 'Ul',
											'attributes' =>
											[
												'id' => 'LanguageMenuList',
												'class' => 'dropdown-menu dropdown-menu-dark'
											]
										]
									]
								]
							]
						]
					],
					[
						'tag' => 'Div',
						'attributes' =>
						[
							'id' => 'ThemeContainer',
							'class' => 'p-2 align-self-center'
						],
						'innerContent' =>
						[
							[
								'tag' => 'A',
								'attributes' =>
								[
									'id' => 'ThemeMenu',
									'class' => 'nav-link dropup',
									'href' => '#',
									'data' =>
									[
										'bs-toggle' => 'dropdown'
									],
									'aria' =>
									[
										'expanded' => 'false'
									],
									'innerContent' =>
									[
										[
											'tag' => 'I',
											'attributes' =>
											[
												'tagID' => 'ThemeMenuIcon',
												'class' => 'bi bi-paint-bucket icon-size'
											]
										],
										[
											'tag' => 'I',
											'attributes' =>
											[
												'class' => 'bi bi-triangle-fill dropup-icon'
											]
										],
										[
											'tag' => 'Ul',
											'attributes' =>
											[
												'id' => 'ThemeMenuList',
												'class' => 'dropdown-menu dropdown-menu-dark'
											]
										]
									]
								]
							]
						]
					]
				]

			]
		);
		$this->workspace->add($this->workspaceFooter);
		$this->menues['language-menu'] = $this->workspace::getTagById('LanguageMenuList');
		$this->menues['theme-menu'] = $this->workspace::getTagById('ThemeMenuList');

		$this->addLanguageDropdown();
	}
	private function addLanguageDropdown(): void
	{
		foreach ($_SERVER['config']['languages'] as $key => $value) {
			$li = new Li(
				[
					'id' => 'Language-'.$value,
					'class' => 'dropdown-item'
				]
			);
			$li->add($value);
			$this->menues['language-menu']->add($li);
		}
	}
	#endregion
}
?>